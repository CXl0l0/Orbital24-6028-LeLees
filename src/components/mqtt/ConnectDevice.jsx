import React from "react";
import mqtt from "mqtt";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";

const ConnectDevice = () => {
  //Mqtt configurations
  const [client, setClient] = useState(null);
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState("Disconnected");

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
        setPayload(topic + ": " + payload);
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
      console.log("Succesfully unsubscribed from urusai1234");
      setStatus("Connected");
    } else {
      client.subscribe("urusai1234");
      console.log("Successfully subscribed to urusai1234");
      setStatus("Subscribed");
    }
  }

  //End of Mqtt configuration

  return (
    <>
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
              Subscribed
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubscribe} disabled>
              Subscribe
            </Button>
          )
        }
      </Box>
      <div>Status: {status}</div>
      <div>
        Message received: <br />
        {payload.toString()}
      </div>
    </>
  );
};

export default ConnectDevice;
