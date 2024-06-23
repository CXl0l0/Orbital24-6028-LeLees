import React from "react";
import mqtt from "mqtt";
import { useState, useEffect } from "react";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import SoundDisplay from "./SoundDisplay";
import { socket } from "../../socket";

const ConnectDevice = ({ deviceName, role, authUser, roomNum }) => {
  //Mqtt configurations
  const [client, setClient] = useState(null);
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState("Disconnected");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on("connect", () => {
        console.log("Succesfully connected to public broker EMQX");
        setStatus("Connected");
      });
      client.on("error", (err) => {
        console.log("Connection error: ", err);
        client.end();
        setStatus("Disconnected");
      });
      client.on("reconnect", () => {
        console.log("MQTT Client Reconnecting");
      });
      client.on("message", (topic, payload) => {
        setPayload(payload);
        console.log(payload.toString());
      });
    }
  }, [client]);

  function handleConnect() {
    if (status === "Disconnected") {
      console.log("Connecting...");
      setStatus("Connecting");
      setClient(mqtt.connect("wss://broker.emqx.io:8084/mqtt"));
    }
  }

  function handleDisconnect() {
    if (client) {
      setStatus("Disconnecting");
      client.end(() => {
        console.log("Disconnected");
        setStatus("Disconnected");
        setPayload("");
      });
    }
  }

  function handleSubscribe() {
    if (status === "Disconnected") {
      setStatus("Error, please connect first");
      setTimeout(() => {
        setStatus("Disconnected");
      }, 2000);
    } else if (status === "Subscribed") {
      client.unsubscribe("urusai1234");
      setTopic("");
      console.log("Succesfully unsubscribed from urusai1234");
      setStatus("Connected");
    } else {
      client.subscribe("urusai1234");
      setTopic("urusai1234");
      console.log("Successfully subscribed to urusai1234");
      setStatus("Subscribed");
    }
  }

  //End of Mqtt configuration

  //Socket.io function

  function handleReport() {
    //Only for user
    console.log(socket);
    const deviceRef = doc(db, "devices", roomNum);
    if (deviceRef) {
      getDoc(deviceRef).then((deviceSnap) => {
        if (deviceSnap.exists()) {
          const pic = deviceSnap.data().pic;
          //Record report case
          setDoc(doc(db, "report", "user", authUser.uid, roomNum), {
            reporter: authUser.displayName,
            pic: pic,
          });
          setDoc(doc(db, "report", "admin", pic, roomNum), {
            reporter: authUser.displayName,
            reporterUID: authUser.uid,
          });
          //emit report event to socket.io server
          socket.emit("reportNotification", authUser.displayName, pic, roomNum);
        }
      });
    }
  }

  return (
    <>
      <center>
        <h1>{deviceName}</h1>
        <h4>Room {roomNum}</h4>
      </center>
      <Box sx={{ "& > button": { m: 1 } }}>
        {
          //Connect button's behavior
          status === "Disconnected" ? (
            <Button variant="contained" onClick={handleConnect}>
              Connect
            </Button>
          ) : status === "Connecting" ? (
            <LoadingButton
              loadingIndicator="Connecting..."
              loading={status === "Connecting"}
              variant="contained"
            >
              <span> Connecting</span>
            </LoadingButton>
          ) : (
            <Button variant="contained" color="success" onClick={handleConnect}>
              Connected
            </Button>
          )
        }
        <br />
        {
          //Disconnect button's behavior
          status === "Disconnected" || status === "Connecting" ? ( //Status disconnected
            <Button
              variant="contained"
              color="error"
              onClick={handleDisconnect}
              disabled
            >
              Disconnect
            </Button>
          ) : status === "Disconnecting" ? (
            //Status connecting
            <LoadingButton
              loadingIndicator="Disconnecting..."
              loading={status === "Disconnecting"}
              variant="contained"
            >
              <span>Disconnecting</span>
            </LoadingButton>
          ) : (
            //Connected
            <Button
              variant="contained"
              color="error"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          )
        }
        <br />
        {
          //Subscribe button's behavior
          status === "Connected" ? (
            <Button variant="contained" onClick={handleSubscribe}>
              Subscribe
            </Button>
          ) : status === "Subscribed" ? (
            <Button variant="outlined" onClick={handleSubscribe}>
              Unsubscribe
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubscribe} disabled>
              Subscribe
            </Button>
          )
        }
        <br />
        {
          //Report button's behavior
          role === "user" &&
            (status === "Subscribed" ? (
              <Button variant="contained" color="error" onClick={handleReport}>
                Report
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                onClick={handleReport}
                disabled
              >
                Report
              </Button>
            ))
        }
      </Box>
      <div>
        Status: {status}
        <br />
        Topic subscribed: {topic}
        <br />
        Message received: <br />
        {payload.toString()}
      </div>

      <Box>{status === "Subscribed" && <SoundDisplay decibel={payload} />}</Box>
    </>
  );
};

export default ConnectDevice;
