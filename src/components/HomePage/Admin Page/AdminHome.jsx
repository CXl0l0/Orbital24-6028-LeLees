import "./AdminHome.css";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { socket } from "../../../socket";
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
import TextField from "@mui/material/TextField";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import ConnectDevice from "../../mqtt/ConnectDevice";
import DeviceCard from "./DeviceCard";

//Taken from material UI "Full-screen dialogs" section under
//https://mui.com/material-ui/react-dialog/
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AdminHome = () => {
  //Tab name
  useEffect(() => {
    document.title = "Admin Home";
  }, []);

  //For navigating to other pages
  const navigate = useNavigate();

  //Firebase Sign Out function
  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
        socket.disconnect();
      })
      .then(() => navigate("/"));
  }

  //Auth user state
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      }
    });

    return () => {
      listen();
    };
  }, []);

  //Socket.io connection
  useEffect(() => {
    if (authUser) {
      const reportSocket = socket.connect();
      console.log(reportSocket);
      socket.emit("newUser", authUser.displayName);
    }
  }, [authUser]);

  //Socket.io listener
  useEffect(() => {
    socket.on("getReport", (msg) => {
      console.log("received report from: " + msg.clientName);
    });
  }, [socket]);

  //Start of admin homepage logic components
  const [signingOut, setSigningOut] = useState(false);
  const [showDevice, setShowDevice] = useState(false);
  const [addingDevice, setAddingDevice] = useState(false);
  const [removingDevice, setRemovingDevice] = useState(false);
  const [targetRemovalDevice, setTargetRemovalDevice] = useState(null);
  const [invalidRoomNumber, setInvalidRoomNumber] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [deviceBoard, setDeviceBoard] = useState(false);
  const [overlayPage, setOverlayPage] = useState("");
  const [devices, setDevices] = useState([]);

  function handleRemoveDevice1(e) {
    e.preventDefault();
    const index = devices.length - 1;
    setDevices([...devices.slice(0, index)]);
  }

  function handleRemoveDevice() {
    setDevices([
      ...devices.slice(0, targetRemovalDevice),
      ...devices.slice(targetRemovalDevice + 1),
    ]);
    setRemovingDevice(false);
  }

  function handleRemovingDevice(i) {
    setRemovingDevice(true);
    setTargetRemovalDevice(i);
  }

  useEffect(() => {
    //Prevent textfield from showing error
    //when adding device again
    setInvalidRoomNumber(false);
  }, [addingDevice]);

  function handleAddDevice(e) {
    e.preventDefault();
    const roomNum = document.getElementById("room-number").value;
    console.log("Entered room number: " + roomNum);
    if (!isNaN(+roomNum) && roomNum !== "") {
      const deviceRef = doc(db, "devices", roomNum.toString());
      //valid input (is number)
      getDoc(deviceRef).then((deviceSnap) => {
        if (deviceSnap.exists()) {
          //Check if already added the device
          const oldlen = devices.length;
          const newlen = devices.filter((device) => {
            return device[1] !== roomNum;
          }).length;

          if (newlen === oldlen) {
            setAddingDevice(false);
            //array of devices which is stored in array of size 2
            //device[0] represents deviceName and device[1] represents roomNum
            setDevices([...devices, [deviceSnap.data().deviceName, roomNum]]);
          } else {
            console.log("Already added this device");
            setInvalidRoomNumber(true);
            setHelperText("Already added this device");
          }
        } else {
          //invalid input
          console.log("Invalid Room Number");
          setInvalidRoomNumber(true);
          setHelperText("Invalid Room Number");
        }
      });
    } else {
      //invalid input
      console.log("Invalid Room Number");
      setInvalidRoomNumber(true);
      setHelperText("Invalid Room Number");
    }
  }

  function handleViewDevice() {
    setDeviceBoard(true);
  }

  function handleCloseDevice() {
    setDeviceBoard(false);
  }

  //End of admin homepage logic components

  return !authUser ? (
    <div className="loading-icon">
      <CircularProgress />
    </div>
  ) : (
    <>
      <div className="admin-home-container">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="secondary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <img src={logo} width={100} alt="urusai logo"></img> urusai!
                Admin Home Page
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
              <IconButton
                aria-label="logout"
                onClick={() => setSigningOut(true)}
              >
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
                    You are about to sign out of urusai! Are you sure you want
                    to sign out?
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
              <h2>Welcome to the home page, {authUser?.displayName}!</h2>
              <h4>Start by adding some devices</h4>
              <Box sx={{ "& > button": { m: 1 } }}>
                <Button variant="contained" onClick={() => setShowDevice(true)}>
                  Show Device
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShowDevice(false)}
                >
                  Unshow Device
                </Button>
              </Box>
              {
                //Add device section
                showDevice && <ConnectDevice />
              }
              <Box sx={{ "& > button": { m: 1 } }}>
                <Button variant="outlined" onClick={handleRemoveDevice1}>
                  - Remove Device
                </Button>
              </Box>
              <h3>Your Devices</h3>
            </center>
            <Box>
              <Grid container padding={4} spacing={6}>
                {devices.map((device, i) => {
                  return (
                    <Grid item xs={6} md={3}>
                      <DeviceCard
                        deviceName={device[0]}
                        roomNumber={device[1]}
                        viewDevice={handleViewDevice}
                        removeDevice={() => handleRemovingDevice(i)}
                      />
                    </Grid>
                  );
                })}
                {
                  //Removing Device's dialog
                  <Dialog
                    open={removingDevice}
                    onClose={() => setRemovingDevice(false)}
                    aria-labelledby="remove-device-title"
                    aria-describedby="remove-device-description"
                  >
                    <DialogTitle>Removing a device...</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        You are about to remove this device, are you sure?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setRemovingDevice(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={handleRemoveDevice}>
                        Remove
                      </Button>
                    </DialogActions>
                  </Dialog>
                  //End of Removing Device's dialog
                }

                <Button
                  variant="outlined"
                  onClick={() => setAddingDevice(true)}
                >
                  + Add Device
                </Button>
                {
                  //Adding Device's dialog
                  <Dialog
                    open={addingDevice}
                    onClose={() => setAddingDevice(false)}
                    aria-labelledby="add-device-title"
                    aria-describedby="add-device-description"
                  >
                    <DialogTitle>Adding a device...</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Please enter your room number.
                      </DialogContentText>
                      {invalidRoomNumber ? ( //entered invalid room number
                        <TextField
                          autoFocus
                          error
                          required
                          margin="dense"
                          label="Room Number"
                          type="text"
                          fullWidth
                          variant="filled"
                          id="room-number"
                          helperText={helperText}
                        />
                      ) : (
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          label="Room Number"
                          type="text"
                          fullWidth
                          variant="filled"
                          id="room-number"
                        />
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setAddingDevice(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={handleAddDevice}>
                        Add
                      </Button>
                    </DialogActions>
                  </Dialog>
                  //End of Adding Device's dialog
                }
              </Grid>
            </Box>

            {
              //Start of Device Board's dialog
              <Dialog
                fullScreen
                open={deviceBoard}
                onClose={handleCloseDevice}
                TransitionComponent={Transition}
              >
                <AppBar sx={{ position: "relative" }}>
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleCloseDevice}
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography
                      sx={{ ml: 2, flex: 1 }}
                      variant="h6"
                      component="div"
                    >
                      Device
                    </Typography>
                  </Toolbar>
                </AppBar>
                <DialogContent>
                  <center>
                    <ConnectDevice />
                  </center>
                </DialogContent>
              </Dialog>
              //End of Device Board's dialog
            }
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHome;
