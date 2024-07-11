import React from "react";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListSubheader,
} from "@mui/material";
import { FixedSizeList } from "react-window";

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemText primary={`Item ${index + 1}`} />
    </ListItem>
  );
}

const EditUserInterface = ({ targetUser, targetUserAccess }) => {
  return (
    <>
      <Box>
        <Container>
          <h1>Edit User</h1>
          <h2>Target User: {targetUser[1]?.username}</h2>
          <h3>User UID: {targetUser[0]}</h3>
        </Container>
        <Container
          sx={{
            width: "100%",
            height: 400,
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
      </Box>
    </>
  );
};

export default EditUserInterface;
