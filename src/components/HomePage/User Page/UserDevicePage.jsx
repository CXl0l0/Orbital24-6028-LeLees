import React, { useEffect, useRef, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import ConnectDevice from "../../mqtt/ConnectDevice";
import UserDeviceCard from "./UserDeviceCard";

//Taken from material UI "Full-screen dialogs" section under
//https://mui.com/material-ui/react-dialog/
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserDevicePage = ({ authUser }) => {
  //Start of admin homepage logic components
  const [addingDevice, setAddingDevice] = useState(false);
  const [removingDevice, setRemovingDevice] = useState(false);
  const [targetRemovalDevice, setTargetRemovalDevice] = useState(null);
  const [invalidRoomNumber, setInvalidRoomNumber] = useState(false);
  const [viewingDevice, setViewingDevice] = useState(["Error", "Error"]);
  const [helperText, setHelperText] = useState("");
  const [deviceBoard, setDeviceBoard] = useState(null);
  const [devices, setDevices] = useState([]);

  //Local storage logic for device card
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      const devices = JSON.parse(
        localStorage.getItem(authUser.uid + "_devices")
      );

      if (devices) {
        setDevices(devices);
        initialized.current = true;
      }
    }
  }, []);

  useEffect(() => {
    refreshDevices();
    console.log("Setting storage to: " + devices);
    localStorage.setItem(authUser.uid + "_devices", JSON.stringify(devices));
  }, [devices]);

  const refreshDevices = async () => {
    //Check if device still exists
    devices.forEach(async (device1) => {
      const ref = doc(db, "devices", device1[1]);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        console.log(device1[1] + " doesnt exists in db");
        setDevices(
          devices.filter((device2) => {
            return device1[1] !== device2[1];
          })
        );
      }
    });
    //Check if user still have permission to view certain devices
    devices.forEach(async (device1) => {
      const ref = doc(
        db,
        "accounts",
        authUser.uid,
        "access",
        device1[1].toString()
      );
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setDevices(
          devices.filter((device2) => {
            return device1[1] !== device2[1];
          })
        );
      }
    });
  };

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
    const permissionRef = doc(
      db,
      "accounts",
      authUser.uid,
      "access",
      roomNum.toString()
    );

    if (!isNaN(+roomNum) && roomNum !== "") {
      //valid input (is number)
      const deviceRef = doc(db, "devices", roomNum.toString());
      getDoc(deviceRef).then((deviceSnap) => {
        if (deviceSnap.exists()) {
          //device exists
          getDoc(permissionRef).then((snapshot) => {
            if (snapshot.exists()) {
              //Permission granted
              //Check if already added the device
              const oldlen = devices.length;
              const newlen = devices.filter((device) => {
                return device[1] !== roomNum;
              }).length;

              if (newlen === oldlen) {
                setAddingDevice(false);
                //array of devices which is stored in array of size 2
                //device[0] represents deviceName and device[1] represents roomNum
                setDevices([
                  ...devices,
                  [deviceSnap.data().deviceName, roomNum],
                ]);
              } else {
                console.log("Already added this device");
                setInvalidRoomNumber(true);
                setHelperText("Already added this device");
              }
            } else {
              //No permission to add/view this device
              console.log("No permission to add this device");
              setInvalidRoomNumber(true);
              setHelperText("No permission to add this device");
            }
          });
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

  return (
    <div>
      <center>
        <h3>Your Devices</h3>
      </center>
      <Box>
        <Grid container padding={4} spacing={6}>
          {devices.map((device, i) => {
            return (
              <Grid item xs={6} md={3}>
                <UserDeviceCard
                  deviceName={device[0]}
                  roomNumber={device[1]}
                  viewDevice={() => {
                    setDeviceBoard(device[1]);
                    setViewingDevice([device[0], device[1]]);
                  }}
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
                <Button onClick={() => setRemovingDevice(false)}>Cancel</Button>
                <Button type="submit" onClick={handleRemoveDevice}>
                  Remove
                </Button>
              </DialogActions>
            </Dialog>
            //End of Removing Device's dialog
          }

          <Button variant="outlined" onClick={() => setAddingDevice(true)}>
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
                    inputProps={{ maxLength: 9 }}
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
                    inputProps={{ maxLength: 9 }}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setAddingDevice(false)}>Cancel</Button>
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
          onClose={() => setDeviceBoard(null)}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDeviceBoard(null)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Device
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <center>
              <ConnectDevice
                role={"user"}
                authUser={authUser}
                roomNum={deviceBoard}
                deviceName={viewingDevice[0]}
              />
            </center>
          </DialogContent>
        </Dialog>
        //End of Device Board's dialog
      }
    </div>
  );
};

export default UserDevicePage;
