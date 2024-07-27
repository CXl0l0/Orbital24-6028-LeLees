import "./AdminHome.css";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { socket } from "../../../socket";
import { auth, db } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Container, IconButton } from "@mui/material";
import { IoLogInOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useNavigate, Navigate } from "react-router-dom";
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
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AdminDevicePage from "./AdminDevicePage";
import ManageDevicePage from "./ManageDevicePage";
import ManageUserPage from "./ManageUserPage";

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

  //User role
  const [role, setRole] = useState(null);
  useEffect(() => {
    console.log("Reading firestore");
    if (authUser) {
      const userRef = doc(db, "accounts", authUser.uid);
      getDoc(userRef).then((userSnap) => {
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData.role);
        } else {
          console.log("User doesnt exist in database");
        }
      });
    }
  }, [authUser]);

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

  return !authUser || !role ? (
    <div className="loading-icon">
      <CircularProgress color="secondary" />
    </div>
  ) : role === "user" ? (
    <>
      <Navigate to={"/"} />
    </>
  ) : (
    <>
      <div className="admin-home-container">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="secondary">
            <Toolbar>
              <img src={logo} width={100} alt="urusai logo"></img>
              <Typography
                variant="h6"
                component="a"
                noWrap
                href="/adminHome"
                sx={{
                  fontFamily: "revert",
                  fontWeight: 600,
                  maxWidth: 250,
                  flexGrow: 1,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                urusai! Admin Home Page
              </Typography>
              <Typography
                sx={{
                  fontFamily: "revert",
                  fontWeight: 600,
                  maxWidth: 2000,
                  flexGrow: 1,
                  color: "inherit",
                  textDecoration: "none",
                }}
              ></Typography>
              {/* Disabled temporarily
                <Tooltip title="Notification">
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
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton
                  aria-label="settings"
                  onClick={() => setOverlayPage("Settings")}
                >
                  <IoMdSettings size={30} />
                </IconButton>
              </Tooltip>
                */}
              <Tooltip title="Account">
                <IconButton
                  aria-label="account"
                  onClick={() => setOverlayPage("Account")}
                >
                  <MdAccountCircle size={30} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  aria-label="logout"
                  onClick={() => setSigningOut(true)}
                >
                  <IoLogInOutline size={30} />
                </IconButton>
              </Tooltip>
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
                      <Tab label="Manage Device" value="manageDeviceTab" />
                      <Tab label="Manage User Access" value="manageUserTab" />
                      <Tab label="Devices" value="addDeviceTab" />
                      <Tab label="Reports" value="reportsTab" />
                    </TabList>
                  </Box>
                  <TabPanel value="manageDeviceTab">
                    <ManageDevicePage authUser={authUser} />
                  </TabPanel>
                  <TabPanel value="manageUserTab">
                    <ManageUserPage authUser={authUser} />
                  </TabPanel>
                  <TabPanel value="addDeviceTab">
                    <AdminDevicePage authUser={authUser} />
                  </TabPanel>
                  <TabPanel value="reportsTab">
                    <AdminReportPage authUser={authUser} />
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
