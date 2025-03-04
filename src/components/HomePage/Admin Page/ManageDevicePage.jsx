import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  TextField,
  Box,
  Button,
  Autocomplete,
  Snackbar,
  Alert,
  Container,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListSubheader,
  Divider,
  Typography,
} from "@mui/material";
import { db } from "../../../firebase/firebase";

const ManageDevicePage = ({ authUser }) => {
  const [deviceName, setDeviceName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [pic, setPic] = useState(null);
  const [authorities, setAuthorities] = useState([]);
  const [devices, setDevices] = useState([]);

  //Obtain authority accounts from database
  const initializedAccount = useRef(false);
  useEffect(() => {
    if (!initializedAccount.current) {
      const accountRef = collection(db, "accounts");
      const q = query(accountRef, where("role", "==", "administration"));
      var temp = [];
      getDocs(q)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const authorityUser = doc.data().username;
            console.log(authorityUser);
            temp.push(authorityUser);
          });
        })
        .then(() => {
          setAuthorities(temp);
        })
        .then(() => {
          initializedAccount.current = true;
        });
    }
  }, []);

  //Obtain devices from database
  const initializedDevice = useRef(false);
  const [refreshDevice, setRefreshDevice] = useState(false);
  useEffect(() => {
    if (!initializedDevice.current) {
      const deviceRef = collection(db, "devices");
      const q = query(deviceRef);
      var temp = [];
      getDocs(q)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const room = doc.id;
            console.log(room);
            temp.push([room, doc.data()]);
          });
        })
        .then(() => {
          setDevices(temp);
        })
        .then(() => {
          initializedDevice.current = true;
        });
    }
  }, [refreshDevice]);

  //Device List & Info logic
  const [targetDevice, setTargetDevice] = useState(null);
  const [targetDeviceUserAccess, setTargetDeviceUserAccess] = useState([]);
  useEffect(() => {
    //Set up the target device's info regarding users with access
    if (targetDevice) {
      console.log("Setting up");
      const ref = collection(db, "devices", targetDevice[0], "users");
      const q = query(ref);
      var temp = [];
      getDocs(q)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            temp.push([doc.id, doc.data()]);
          });
        })
        .then(() => {
          console.log(temp);
          setTargetDeviceUserAccess(temp);
        });
    }
  }, [targetDevice]);

  //Create device logic
  const [createdDevice, setCreatedDevice] = useState(false);
  const [resetCreateDeviceInputField, setResetCreateDeviceInputField] =
    useState(false);

  function handleCloseSuccessSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setCreatedDevice(false);
  }

  function handleCreateDevice(e) {
    e.preventDefault();
    console.log("Checking input validity...");
    setError(null);
    //Device never added before
    const re = /^[0-9\b]+$/; //Test room number validity
    if (!re.test(roomNumber)) {
      //User entered an invalid room number
      console.log("Please enter a valid room number");
      setError("Room Number");
    } else if (pic === null) {
      //User didn't select a pic
      console.log("Please select a pic");
      setError("pic");
    } else {
      const deviceRef = doc(db, "devices", roomNumber);
      getDoc(deviceRef).then((snapshot) => {
        if (!snapshot.exists()) {
          //All valid, proceeds to create device
          console.log("Creating device...");
          setDoc(doc(db, "devices", roomNumber), {
            deviceName: deviceName,
            pic: pic,
          })
            .then(() => {
              console.log("Created device");
              setCreatedDevice(true);
              initializedDevice.current = false;
              setRefreshDevice(!refreshDevice);
              setDeviceName("");
              setRoomNumber("");
              setPic(null);
              setResetCreateDeviceInputField(!resetCreateDeviceInputField);
            })
            .catch((e) => console.log(e));
        } else {
          //Device already exists
          console.log("Device already exists");
          setError("Duplicate Device");
        }
      });
    }
  }
  //End of create device logic

  //Delete device logic
  const [deleteDevice, setDeleteDevice] = useState(null);
  const [deletedDevice, setDeletedDevice] = useState(false);
  const [resetDeleteDeviceInputField, setResetDeleteDeviceInputField] =
    useState(false);
  function handleCloseDeletedDeviceSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setDeletedDevice(false);
  }

  function handleDeleteDevice(e) {
    e.preventDefault();
    setError(null);
    console.log("Checking validity...");
    if (deleteDevice === null) {
      //User didnt select a device to be deleted
      console.log("Please select a device to be deleted");
      setError("Delete device");
    } else {
      console.log("Deleting device...");
      console.log(deleteDevice);
      deleteDoc(doc(db, "devices", deleteDevice))
        .then(() => {
          //Remove deleted device from device page (if added)
          console.log("Removing the deleted device from device page");
          const beforeDelete = JSON.parse(
            localStorage.getItem(authUser.uid + "_devices")
          );
          const afterDelete = beforeDelete.filter((device) => {
            return device[1] !== deleteDevice;
          });
          localStorage.setItem(
            authUser.uid + "_devices",
            JSON.stringify(afterDelete)
          );
        })
        .then(() => {
          //Delete device's access from accounts
          const accountRef = collection(db, "accounts");
          getDocs(accountRef).then((accountsSnap) => {
            accountsSnap.forEach((account) => {
              deleteDoc(
                doc(db, "accounts", account.id, "access", deleteDevice)
              );
            });
          });
        })
        .then(() => {
          //Delete subcollection
          const usersAccessRef = collection(
            db,
            "devices",
            deleteDevice,
            "users"
          );
          getDocs(usersAccessRef).then((accessSnap) => {
            accessSnap.forEach((user) => {
              deleteDoc(doc(db, "devices", deleteDevice, "users", user.id));
            });
          });
        })
        .then(() => {
          console.log("Deleted device");
          if (targetDevice && targetDevice[0] === deleteDevice) {
            setTargetDevice(null);
          }
          setDeletedDevice(true);
          initializedDevice.current = false;
          setResetDeleteDeviceInputField(!resetDeleteDeviceInputField);
          setRefreshDevice(!refreshDevice);
          setDeleteDevice(null);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  //End of delete device logic

  //Error handling
  const [error, setError] = useState(null);
  function handleCloseSnackBar(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setError(null);
  }

  return (
    <>
      <Stack sx={{ width: "100vw", height: "40vh" }}>
        <Box display={"flex"}>
          <Container
            sx={{
              margin: 2,
              width: "43vw",
              border: 1,
            }}
          >
            <Typography
              sx={{
                borderBottom: 1,
              }}
            >
              <h1>Device List</h1>
            </Typography>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                height: 300,
              }}
              subheader={<li />}
            >
              <li>
                <ul>
                  <ListSubheader sx={{ padding: "2px" }}>Rooms:</ListSubheader>
                  {devices.map((device) => {
                    return (
                      <>
                        <ListItemButton
                          onClick={() => {
                            setTargetDevice(device);
                          }}
                          selected={targetDevice === device}
                        >
                          <ListItemText primary={`Room ${device[0]}`} />
                        </ListItemButton>
                        <Divider />
                      </>
                    );
                  })}
                </ul>
              </li>
            </List>
          </Container>
          <Container
            sx={{
              margin: 2,
              marginLeft: 4,
              width: "45vw",
              border: 1,
            }}
          >
            <Typography
              sx={{
                borderBottom: 1,
              }}
            >
              <h1>Device Info</h1>
            </Typography>
            <Typography>
              <h2>Device Name: {targetDevice && targetDevice[1].deviceName}</h2>
              <h3>Device PIC: {targetDevice && targetDevice[1].pic}</h3>
            </Typography>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                height: 230,
              }}
              subheader={<li />}
            >
              <li>
                <ul>
                  <ListSubheader sx={{ padding: "2px" }}>
                    Users with access:
                  </ListSubheader>
                  {targetDeviceUserAccess.length === 0 ? (
                    <p>None</p>
                  ) : (
                    targetDeviceUserAccess.map((user) => {
                      return (
                        <>
                          <ListItem>{user[1].username}</ListItem>
                          <Divider />
                        </>
                      );
                    })
                  )}
                </ul>
              </li>
            </List>
          </Container>
        </Box>
      </Stack>
      <Divider />
      <Stack>
        <Box display={"flex"}>
          <Container
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <h1>Create Device</h1>
            <form onSubmit={handleCreateDevice}>
              <TextField
                required
                sx={{ width: "40vw", marginBottom: 2, marginTop: 1 }}
                id="create-device-name"
                label="Enter Device Name"
                variant="outlined"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                helperText={
                  deviceName.length < 20
                    ? `${deviceName.length}/20`
                    : "Max characters reached"
                }
                inputProps={{ maxLength: 20 }}
              />
              <TextField
                required
                sx={{ marginBottom: 2 }}
                id="create-device-room-number"
                label="Enter Room Number"
                variant="outlined"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                helperText={
                  roomNumber.length < 9
                    ? `${roomNumber.length}/9`
                    : "Max characters reached"
                }
                inputProps={{ maxLength: 9 }}
              />
              <Autocomplete
                key={resetCreateDeviceInputField}
                sx={{ marginBottom: 2 }}
                disablePortal
                id="create-device-pic"
                options={authorities}
                onChange={(event, value) => {
                  setPic(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Person In Charge" />
                )}
              />
              <Button variant="contained" size="medium" type="submit">
                Create Device
              </Button>
            </form>
          </Container>
          <Container
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <h1>Delete Device</h1>
            <form onSubmit={handleDeleteDevice}>
              <Autocomplete
                key={resetDeleteDeviceInputField}
                disablePortal
                id="delete-device"
                options={devices.map((device) => {
                  return device[0];
                })}
                onChange={(event, value) => {
                  setDeleteDevice(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Delete A Device" />
                )}
              />
              <br />
              <Button
                variant="contained"
                size="medium"
                type="submit"
                color="error"
              >
                Delete Device
              </Button>
            </form>
          </Container>
        </Box>
      </Stack>
      {
        //Snackbars
        <>
          <Snackbar //Invalid room number
            open={error === "Room Number"}
            autoHideDuration={4000}
            onClose={handleCloseSnackBar}
          >
            <Alert
              onClose={handleCloseSnackBar}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Please enter a valid room number.
            </Alert>
          </Snackbar>
          <Snackbar //PIC not selected
            open={error === "pic"}
            autoHideDuration={4000}
            onClose={handleCloseSnackBar}
          >
            <Alert
              onClose={handleCloseSnackBar}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Please select a person in charge.
            </Alert>
          </Snackbar>
          <Snackbar //Device to be deleted not selected
            autoHideDuration={4000}
            onClose={handleCloseSnackBar}
            open={error === "Delete device"}
          >
            <Alert
              onClose={handleCloseSnackBar}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Please select a device to be deleted.
            </Alert>
          </Snackbar>
          <Snackbar //Duplicate device
            autoHideDuration={4000}
            onClose={handleCloseSnackBar}
            open={error === "Duplicate Device"}
          >
            <Alert
              onClose={handleCloseSnackBar}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              This device already exists.
            </Alert>
          </Snackbar>
          <Snackbar //Successfully deleted device
            autoHideDuration={4000}
            open={deletedDevice}
            onClose={handleCloseDeletedDeviceSnackbar}
          >
            <Alert
              onClose={handleCloseDeletedDeviceSnackbar}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Deleted device.
            </Alert>
          </Snackbar>
          <Snackbar //Successfully created device
            autoHideDuration={4000}
            onClose={handleCloseSuccessSnackbar}
            open={createdDevice}
          >
            <Alert
              onClose={handleCloseSuccessSnackbar}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Successfully created device.
            </Alert>
          </Snackbar>
        </>
      }
    </>
  );
};

export default ManageDevicePage;
