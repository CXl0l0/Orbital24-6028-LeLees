import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
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
} from "@mui/material";
import { db } from "../../../firebase/firebase";
import { create } from "@mui/material/styles/createTransitions";

const ManageDevicePage = () => {
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
            temp.push(room);
          });
        })
        .then(() => {
          setDevices(temp);
        })
        .then(() => {
          initializedDevice.current = true;
        });
    }
  }, []);

  //Create device logic
  const [createdDevice, setCreatedDevice] = useState(false);
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
      //All valid, proceeds to create device
      console.log("Creating device...");
      setDoc(doc(db, "devices", roomNumber), {
        deviceName: deviceName,
        pic: pic,
      })
        .then(() => {
          console.log("Created device");
          setCreatedDevice(true);
        })
        .catch((e) => console.log(e));
    }
  }
  //End of create device logic

  //Delete device logic
  const [deleteDevice, setDeleteDevice] = useState(null);
  const [deletedDevice, setDeletedDevice] = useState(false);
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
          console.log("Deleted device");
          setDeletedDevice(true);
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
      <form onSubmit={handleCreateDevice}>
        <Box
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            id="create-device-name"
            label="Enter Device Name"
            variant="outlined"
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
            id="create-device-room-number"
            label="Enter Room Number"
            variant="outlined"
            onChange={(e) => setRoomNumber(e.target.value)}
            helperText={
              roomNumber.length < 9
                ? `${roomNumber.length}/9`
                : "Max characters reached"
            }
            inputProps={{ maxLength: 9 }}
          />
          <Autocomplete
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
          <br />
          <Button variant="contained" size="medium" type="submit">
            Create Device
          </Button>
        </Box>
      </form>
      <form onSubmit={handleDeleteDevice}>
        <Box
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <Autocomplete
            disablePortal
            id="delete-device"
            options={devices}
            onChange={(event, value) => {
              setDeleteDevice(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Delete A Device" />
            )}
          />
          <Button variant="contained" size="medium" type="submit" color="error">
            Delete Device
          </Button>
        </Box>
      </form>
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
          <Snackbar //Successfully deleted device
            autoHideDuration={4000}
            open={deletedDevice}
            onClose={handleCloseDeletedDeviceSnackbar}
          >
            <Alert
              onClose={handleCloseDeletedDeviceSnackbar}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Successfully deleted device.
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
