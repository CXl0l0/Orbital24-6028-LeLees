import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { IconButton } from "@mui/material";
import { IoLogInOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import mqtt from "mqtt";
import logo from "../../images/urusai.png";
import SettingsPage from "./SettingsPage";
import AccountPage from "./AccountPage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ConnectDevice from "../../mqtt/ConnectDevice";

export const AdminHome = () => {
  //For navigating to other pages
  const navigate = useNavigate();
  //Sign Out function
  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
      })
      .then(() => navigate("/"));
  }

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
      setStatus("Connecting...");
      setClient(mqtt.connect("wss://broker.emqx.io:8084/mqtt"));
    }
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
    if (status === "Connected" || status === "Subscribed") {
      client.subscribe("urusai1234");
      console.log("Successfully subscribed to urusai1234");
      setStatus("Subscribed");
    } else {
      setStatus("Error, please connect first");
      setTimeout(() => {
        setStatus("Disconnected");
      }, 2000);
    }
  }

  //End of Mqtt configuration

  //Start of admin homepage logic components
  const [signingOut, setSigningOut] = useState(false);
  const [overlayPage, setOverlayPage] = useState("");
  const [addDevice, setAddDevice] = useState(false);

  //End dof admin homepage logic components

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img src={logo} width={100}></img> urusai! Admin Home Page
            </Typography>
            <IconButton
              aria-label="settings"
              onClick={() => setOverlayPage("Settings")}
            >
              <IoMdSettings size={30} />
            </IconButton>
            <IconButton
              aria-label="account"
              onClick={() => setOverlayPage("Account")}
            >
              <MdAccountCircle size={30} />
            </IconButton>
            <IconButton aria-label="logout" onClick={() => setSigningOut(true)}>
              <IoLogInOutline size={30} />
            </IconButton>
            <Dialog
              open={signingOut}
              onClose={() => setSigningOut(false)}
              aria-labelledby="signOut-alert-title"
              aria-describedby="signingOut-alert-description"
            >
              <DialogTitle id="signingOut-alert-title">Sign Out?</DialogTitle>
              <DialogContent>
                <DialogContentText id="signingOut-alert-description">
                  You are about to sign out of urusai! Are you sure you want to
                  sign out?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSigningOut(false)}>Stay</Button>
                <Button onClick={userSignOut} autoFocus>
                  Sign Out
                </Button>
              </DialogActions>
            </Dialog>
          </Toolbar>
        </AppBar>
      </Box>
      {overlayPage !== "" ? (
        overlayPage === "Settings" ? (
          <SettingsPage goBack={() => setOverlayPage("")}></SettingsPage>
        ) : (
          overlayPage === "Account" && (
            <AccountPage goBack={() => setOverlayPage("")}></AccountPage>
          )
        )
      ) : (
        <center>
          <h2>Welcome to the home page, {auth.currentUser.displayName}!</h2>
          <Button variant="contained" onClick={() => setAddDevice(true)}>
            Add Device
          </Button>
          <Button variant="contained" onClick={() => setAddDevice(false)}>
            Delete Device
          </Button>
          <br />
          <br />
          {addDevice && <ConnectDevice />}
        </center>
      )}
    </>
  );
};
