import { useEffect, useState } from "react";
import { IoIosUndo } from "react-icons/io";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { socket } from "../../socket";

const NotificationPage = (prop) => {
  const [notifications, setNotifications] = useState([]);

  //Socket.io listener
  useEffect(() => {
    socket.on("getReport", (msg) => {
      const reporter = msg.clientName;
      console.log("received report from: " + reporter);
      setNotifications((prev) => [...prev, reporter]);
    });
  }, [socket]);

  return (
    <>
      <Box>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Notification
          </Typography>
          <IconButton aria-label="backToHomePage" onClick={prop.goBack}>
            <IoIosUndo size={30} />
          </IconButton>
        </Toolbar>
      </Box>
      <div className="notification-dashboard">
        <h4>You will receive notifications here</h4>
        {notifications.map((notification) => {
          return <div>You've received a report from {notification}</div>;
        })}
      </div>
    </>
  );
};

export default NotificationPage;
