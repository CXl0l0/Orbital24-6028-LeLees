import { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const EditUserInterface = ({ targetUser, targetUserAccess }) => {
  const [devicesInfo, setDevicesInfo] = useState([]);
  const [targetRoom, setTargetRoom] = useState(null);

  //Obtain available rooms from database
  const initializedAccount = useRef(false);
  useEffect(() => {
    if (!initializedAccount.current) {
      const deviceRef = collection(db, "devices");
      var temp = [];
      getDocs(deviceRef)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            temp.push([doc.id, doc.data()]);
          });
        })
        .then(() => {
          setDevicesInfo(temp);
        })
        .then(() => {
          initializedAccount.current = true;
        });
    }
  }, []);

  //Add access logic
  function addAccess() {
    console.log("Adding access");
    const uid = targetUser[0];
    setDoc(doc(db, "accounts", uid, "access", targetRoom), {
      dummy: "field",
    }).then(() => {
      console.log("Done adding access to user " + targetUser[1].username);
    });
  }

  //Remove access logic
  function removeAccess() {
    console.log("Removing access");
  }

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
          }}
        >
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 260,
              "& ul": { padding: 0 },
            }}
            subheader={<li />}
          >
            <li>
              <ul>
                <ListSubheader sx={{ padding: "2px" }}>
                  This user have the following rooms' access:
                </ListSubheader>
                {targetUserAccess.length === 0 ? ( //No room access at all
                  <ListItem>None</ListItem>
                ) : (
                  targetUserAccess.map((roomNum) => (
                    <ListItem key={`room-${roomNum}`}>
                      <ListItemText primary={`Room ${roomNum}`} />
                    </ListItem>
                  ))
                )}
              </ul>
            </li>
          </List>
        </Container>
        <Container>
          {targetUser && (
            <>
              <Autocomplete
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
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default EditUserInterface;
