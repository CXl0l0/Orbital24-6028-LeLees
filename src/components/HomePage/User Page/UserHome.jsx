import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { IoLogInOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../images/urusai.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ConnectDevice from "../../mqtt/ConnectDevice";
import SettingsPage from "../SettingsPage";
import AccountPage from "../AccountPage";

const UserHome = () => {
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

  //Start of admin homepage logic components
  const [signingOut, setSigningOut] = useState(false);
  const [overlayPage, setOverlayPage] = useState("");
  const [addDevice, setAddDevice] = useState(false);
  //End of admin homepage logic components

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img src={logo} width={100}></img> urusai! User Home Page
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

export default UserHome;
