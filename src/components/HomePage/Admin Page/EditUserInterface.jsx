import { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemButton,
  Autocomplete,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const EditUserInterface = ({
  targetUser,
  targetUserAccess,
  refreshUserAccess,
}) => {
  const [devicesInfo, setDevicesInfo] = useState([]);
  //Obtain available rooms from database
  const initializedAccount = useRef(false);
  useEffect(() => {
    if (!initializedAccount.current) {
      console.log("Refreshing");
      const deviceRef = collection(db, "devices");
      var temp = [];
      getDocs(deviceRef)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            temp.push([doc.id, doc.data()]);
          });
        })
        .then(() => {
          console.log("Setting device info");
          setDevicesInfo(temp);
        })
        .then(() => {
          initializedAccount.current = true;
        });
    }
  }, []);

  //Add access logic
  const [targetRoom, setTargetRoom] = useState(null);
  const [resetInputField, setResetInputField] = useState(false);
  useEffect(() => {
    setResetInputField(!resetInputField);
  }, [targetUser]);

  //Snackbar
  const [addedAccess, setAddedAccess] = useState(false);

  function addAccess() {
    console.log("Adding access");
    const uid = targetUser[0];
    //Modify user access file
    setDoc(doc(db, "accounts", uid, "access", targetRoom), {
      dummy: "field",
    })
      .then(() => {
        //Modify device's users file
        setDoc(doc(db, "devices", targetRoom, "users", targetUser[0]), {
          username: targetUser[1].username,
        });
      })
      .then(() => {
        console.log("Done adding access to user " + targetUser[1].username);
        setTargetRoom(null);
      })
      .then(() => {
        refreshUserAccess();
        setResetInputField(!resetInputField);
        setAddedAccess(true);
      });
  }

  //Remove access logic
  const [removalTarget, setRemovalTarget] = useState(null);
  //Snackbar
  const [removedAccess, setRemovedAccess] = useState(false);

  function removeAccess() {
    console.log("Removing access of " + removalTarget);
    const uid = targetUser[0];
    //Delete doc from user
    deleteDoc(doc(db, "accounts", uid, "access", removalTarget)).then(() => {
      //Delete doc from device
      deleteDoc(doc(db, "devices", removalTarget, "users", uid))
        .then(() => {
          console.log("Done removing access of " + removalTarget);
          setRemovalTarget(null);
        })
        .then(() => {
          refreshUserAccess();
          setRemovedAccess(true);
        });
    });
  }

  //Close snackbar function
  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setRemovedAccess(false);
    setAddedAccess(false);
  }

  //Ensure the subtargets is refreshed everytime the targetUser changed
  useEffect(() => {
    setTargetRoom(null);
    setRemovalTarget(null);
  }, [targetUser, targetUserAccess]);

  return (
    <>
      <Box>
        <Container>
          <h1>Edit User Access</h1>
          <h2>Target User: {targetUser && targetUser[1]?.username}</h2>
          <h3>User UID: {targetUser && targetUser[0]}</h3>
        </Container>
        <Container
          sx={{
            width: "100%",
            height: 300,
            maxWidth: 360,
            bgcolor: "background.paper",
            border: 1,
            margin: 2,
          }}
        >
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 260,
            }}
            subheader={<li />}
          >
            <li>
              <ul>
                <ListSubheader sx={{ padding: "2px" }}>
                  This user have the following rooms' access:
                </ListSubheader>
                {targetUserAccess === "Loading" ? ( //Loading
                  <ListItem>Loading...</ListItem>
                ) : targetUserAccess.length === 0 ? ( //No room access at all
                  <ListItem>None</ListItem>
                ) : (
                  targetUserAccess.map((roomNum) => (
                    <>
                      <ListItemButton
                        onClick={() => setRemovalTarget(roomNum)}
                        key={`room-${roomNum}`}
                        selected={removalTarget === roomNum}
                      >
                        <ListItemText primary={`Room ${roomNum}`} />
                      </ListItemButton>
                      <Divider />
                    </>
                  ))
                )}
              </ul>
            </li>
          </List>
        </Container>
        <Container>
          {removalTarget ? (
            <Button
              variant="contained"
              size="medium"
              type="submit"
              color="error"
              onClick={removeAccess}
            >
              Remove Access
            </Button>
          ) : (
            <Button
              variant="contained"
              size="medium"
              type="submit"
              color="error"
              disabled
            >
              Remove access
            </Button>
          )}
          {
            //Snackbar for remove access
            <Snackbar
              open={removedAccess}
              autoHideDuration={2000}
              onClose={handleCloseSnackbar}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                Successfully removed access.
              </Alert>
            </Snackbar>
          }
        </Container>
        <Container>
          <br />
          {targetUser && (
            <>
              <Autocomplete
                key={resetInputField}
                disablePortal
                id="add-access"
                options={devicesInfo
                  .map((info) => {
                    return info[0];
                  })
                  .filter((roomNum) => {
                    return !targetUserAccess.includes(roomNum);
                  })}
                onChange={(event, value) => {
                  setTargetRoom(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Add access" />
                )}
              />
              <br />
              <h3>
                Device Name:{" "}
                {targetRoom &&
                  devicesInfo.find((info) => {
                    return info[0] === targetRoom;
                  })[1].deviceName}
              </h3>
              <h3>
                Person In Charge:{" "}
                {targetRoom &&
                  devicesInfo.find((info) => {
                    return info[0] === targetRoom;
                  })[1].pic}
              </h3>
              <br />
              {targetRoom ? (
                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  onClick={addAccess}
                >
                  Add
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  disabled
                >
                  Add
                </Button>
              )}
              {
                //Snackbar for add access
                <Snackbar
                  open={addedAccess}
                  autoHideDuration={2000}
                  onClose={handleCloseSnackbar}
                >
                  <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    Successfully added access.
                  </Alert>
                </Snackbar>
              }
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default EditUserInterface;
