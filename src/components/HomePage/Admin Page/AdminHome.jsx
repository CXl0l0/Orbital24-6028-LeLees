import "./AdminHome.css";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { socket } from "../../../socket";
import { auth } from "../../../firebase/firebase";
import { IconButton } from "@mui/material";
import { IoLogInOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../images/urusai.png";
import AdminReportPage from "./AdminReportPage";
import SettingsPage from "../SettingsPage";
import AccountPage from "../AccountPage";
import NotificationPage from "../NotificationPage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";
import Badge from "@mui/material/Badge";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AdminDevicePage from "./AdminDevicePage";

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
  }, [socket, authUser]);

  //Socket.io listener
  useEffect(() => {
    const handleGetReport = (msg) => {
      const reporter = msg.clientName;
      const roomNum = msg.roomNum;
      console.log("received report from: " + reporter + " at room " + roomNum);
      setNotifications((prev) => [...prev, { reporter, roomNum }]);
    };

    socket.on("getReport", handleGetReport);

    // Cleanup function to remove the listener on component unmount
    return () => {
      socket.off("getReport", handleGetReport);
    };
  }, [socket]);

  const [notifications, setNotifications] = useState([]);

  //Start of admin homepage logic components
  const [signingOut, setSigningOut] = useState(false);
  const [overlayPage, setOverlayPage] = useState("");

  //Tab Logic
  const [tabValue, setTabValue] = useState("addDeviceTab");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
                aria-label="notification"
                onClick={() => setOverlayPage("Notification")}
              >
                <Badge
                  badgeContent={notifications.length}
                  max={9}
                  overlap="circular"
                  color="error"
                >
                  <IoIosNotifications size={30} />
                </Badge>
              </IconButton>
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
        {
          //Overlay page
          overlayPage !== "" ? (
            overlayPage === "Settings" ? (
              <SettingsPage goBack={() => setOverlayPage("")}></SettingsPage>
            ) : overlayPage === "Notification" ? (
              <NotificationPage
                notifications={notifications}
                goBack={() => setOverlayPage("")}
              />
            ) : (
              overlayPage === "Account" && (
                <AccountPage goBack={() => setOverlayPage("")}></AccountPage>
              )
            )
          ) : (
            //Default home page
            <>
              <Box sx={{ width: "100%" }}>
                <TabContext value={tabValue}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleTabChange} centered>
                      <Tab label="Devices" value="addDeviceTab" />
                      <Tab label="Reports" value="reportsTab" />
                    </TabList>
                  </Box>
                  <TabPanel value="addDeviceTab">
                    <AdminDevicePage />
                  </TabPanel>
                  <TabPanel value="reportsTab">
                    <AdminReportPage />
                  </TabPanel>
                </TabContext>
              </Box>
            </>
          )
        }
      </div>
    </>
  );
};

export default AdminHome;
