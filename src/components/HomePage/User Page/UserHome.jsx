import "./UserHome.css";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { socket } from "../../../socket";
import { IconButton } from "@mui/material";
import { IoLogInOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate, Navigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../images/urusai.png";
import SettingsPage from "../SettingsPage";
import AccountPage from "../AccountPage";
import NotificationPage from "../NotificationPage";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserReportPage from "./UserReportPage";
import UserDevicePage from "./UserDevicePage";

//Taken from material UI "Full-screen dialogs" section under
//https://mui.com/material-ui/react-dialog/
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserHome = () => {
  //For navigating to other pages
  const navigate = useNavigate();

  //Sign Out function
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
      console.log(socket.connect());
      socket.emit("newUser", authUser.displayName);
    }
  }, [authUser]);

  //Socket.io function

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
      <CircularProgress />
    </div>
  ) : role === "administration" ? (
    <>
      <Navigate to={"/"} />
    </>
  ) : (
    <>
      <div className="user-home-container">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <img src={logo} width={100}></img>
              <Typography
                variant="h6"
                component="a"
                noWrap
                href="/userHome"
                sx={{
                  fontFamily: "revert",
                  fontWeight: 600,
                  maxWidth: 230,
                  flexGrow: 1,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                urusai! User Home Page
              </Typography>
              <Typography
                sx={{
                  fontFamily: "revert",
                  fontWeight: 600,
                  maxWidth: 2020,
                  flexGrow: 1,
                  color: "inherit",
                  textDecoration: "none",
                }}
              ></Typography>
              <Tooltip title="Account">
                <IconButton
                  aria-label="account"
                  onClick={() => setOverlayPage("Account")}
                >
                  <MdAccountCircle size={30} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sign Out">
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
        {overlayPage !== "" ? (
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
                  <UserDevicePage authUser={authUser} />
                </TabPanel>
                <TabPanel value="reportsTab">
                  <UserReportPage authUser={authUser} />
                </TabPanel>
              </TabContext>
            </Box>
          </>
        )}
      </div>
    </>
  );
};

export default UserHome;
