import React from "react";
import mqtt from "mqtt";
import { useState, useEffect } from "react";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import SoundBar from "./SoundBar";
import { socket } from "../../socket";
import SoundVisualizer from "./SoundVisualizer";
import {
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";

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
        const jsonString = new TextDecoder().decode(payload);
        const jsonData = JSON.parse(jsonString);
        const soundValue = jsonData["Sound value"];
        console.log(soundValue);
        setPayload(soundValue);
      });
    }

    return () => {
      if (client) {
        client.end(() => {
          console.log("Dismounting connect device page");
        });
      }
    };
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

  //Report function
  const [reporting, setReporting] = useState(false);
  const [description, setDescription] = useState("");

  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  function handleReport() {
    //Only for user
    const time = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();
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
            status: "Pending",
            time: time,
            date: date,
            description: description,
          });
          setDoc(doc(db, "report", "admin", pic, roomNum), {
            reporter: authUser.displayName,
            userUID: authUser.uid,
            status: "Pending",
            time: time,
            date: date,
            description: description,
          });
          //emit report event to socket.io server
          socket.emit("reportNotification", authUser.displayName, pic, roomNum);
        }
      });
    }
  }

  //Snackbar logic
  const [snackbar, setSnackbar] = useState(false);
  function handleCloseSnackBar(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar(false);
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
            //Status disconnecting
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
              <Button
                variant="contained"
                color="error"
                onClick={() => setReporting(true)}
              >
                Report
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                onClick={() => setReporting(true)}
                disabled
              >
                Report
              </Button>
            ))
        }
        {
          //Report dialog
          <Dialog open={reporting} onClose={() => setReporting(false)}>
            <DialogTitle>Reporting to the administration</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You are about to report an issue to the administration.
              </DialogContentText>
              <TextField
                autoFocus
                id="description"
                type="text"
                label="Please
                illustrate your problem briefly. (optional)"
                fullWidth
                margin="normal"
                variant="filled"
                multiline
                inputProps={{ maxLength: 200 }} //200 characters limit
                helperText={`${description.length}/200`}
                onChange={handleDescription}
                rows={4}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReporting(false)}>Cancel</Button>
              <Button
                type="submit"
                onClick={() => {
                  handleReport();
                  setReporting(false);
                  setSnackbar(true);
                }}
                color="error"
              >
                Report
              </Button>
            </DialogActions>
          </Dialog>
          //End of report dialog
        }
        {
          //Snackbar for cancelling report
          <Snackbar
            open={snackbar}
            autoHideDuration={2000}
            onClose={handleCloseSnackBar}
            message="Report submitted."
          />
        }
      </Box>
      <div>
        Status: {status}
        <br />
        Topic subscribed: {topic}
        <br />
        Raw Digital Value: {payload.toString()} <br />
        Voltage value: {((payload / 4095) * 5).toFixed(3)}V / 5V
      </div>
      <br />
      <Box>
        {status === "Subscribed" && (
          <>
            <SoundBar soundData={payload} />
            <SoundVisualizer voltage={((payload / 4095) * 5).toFixed(3)} />
          </>
        )}
      </Box>
    </>
  );
};

export default ConnectDevice;
