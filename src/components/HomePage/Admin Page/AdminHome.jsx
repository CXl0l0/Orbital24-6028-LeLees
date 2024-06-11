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
import logo from "../../images/urusai.png";
import SettingsPage from "../SettingsPage";
import AccountPage from "../AccountPage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";
import ConnectDevice from "../../mqtt/ConnectDevice";
import AddDeviceCard from "./AddDeviceCard";

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
            {
              //Sign out dialog
            }
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
            {
              //End of sign out dialog
            }
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
        <div>
          <center>
            <h2>Welcome to the home page, {auth.currentUser.displayName}!</h2>
            <h4>Start by adding some devices</h4>
            <Box sx={{ "& > button": { m: 1 } }}>
              <Button variant="contained" onClick={() => setAddDevice(true)}>
                + Add Device
              </Button>
              <Button variant="contained" onClick={() => setAddDevice(false)}>
                - Remove Device
              </Button>
            </Box>
            {
              //Add device section
              addDevice && <ConnectDevice />
            }
          </center>
          <Box>
            <Grid container padding={4} spacing={4}>
              <Grid xs={6} md={3}>
                <AddDeviceCard />
              </Grid>
              <Grid xs={6} md={3}>
                <AddDeviceCard />
              </Grid>
              <Grid xs={6} md={3}>
                <AddDeviceCard />
              </Grid>
              <Grid xs={6} md={3}>
                <AddDeviceCard />
              </Grid>
            </Grid>
          </Box>
        </div>
      )}
    </>
  );
};
