import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../images/urusai.png";
import mqtt from "mqtt";

export const AdminHome = () => {
  const navigate = useNavigate();
  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
      })
      .then(() => navigate("/"));
  }

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
      client.on("message", function (topic, payload) {
        setPayload(payload);
        console.log(payload.toString());
      });
    }
  }, [client]);

  function handleConnect() {
    console.log("Connecting...");
    setStatus("Connecting...");
    setClient(mqtt.connect("ws://broker.emqx.io:8083/mqtt"));
  }

  function handleDisconnect() {
    if (client) {
      setStatus("Disconnecting...");
      client.end(() => {
        console.log("Disconnected");
        setStatus("Disconnected");
      });
    }
  }

  function handleSubscribe() {
    if (status === "Connected") {
      client.subscribe("urusai1234");
      console.log("Successfully subscribed to urusai1234");
      setPayload("Subscribed, awaiting message...");
    } else {
      setStatus("Error, please connect first");
      setTimeout(() => {
        setStatus("Disconnected");
      }, 2000);
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img src={logo} width={100}></img> urusai! Admin Home Page
            </Typography>
            <Button variant="contained">Settings</Button>
            <Button variant="contained">Account</Button>
            <Button variant="contained" onClick={userSignOut}>
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <center>
        <h2>Welcome, {auth.currentUser.displayName}!</h2>
        <Button variant="contained" onClick={handleConnect}>
          Connect
        </Button>
        <Button variant="contained" onClick={handleDisconnect}>
          Disconnect
        </Button>
        <Button variant="contained" onClick={handleSubscribe}>
          Subscribe
        </Button>
        <div>Status: {status}</div>
        <div>
          Message received: <br />
          {payload.toString()}
        </div>
      </center>
    </>
  );
};
