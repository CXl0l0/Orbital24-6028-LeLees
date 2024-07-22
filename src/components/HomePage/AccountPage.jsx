import React, { useState, useEffect } from "react";
import { IoIosUndo } from "react-icons/io";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
} from "firebase/firestore";
import {
  Box,
  Divider,
  Toolbar,
  Typography,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  IconButton,
  Container,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { socket } from "../../socket";

const AccountPage = (prop) => {
  //For navigating to other pages
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(auth.currentUser);
  const [userDoc, setUserDoc] = useState(null);
  const [role, setRole] = useState("");
  const [id, setID] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("Reading firestore");
    const userRef = doc(db, "accounts", authUser.uid);
    getDoc(userRef)
      .then((userSnap) => {
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserDoc(userData);
          setRole(userData.role);
          setID(userData.id);
        } else {
          console.log("User doesnt exist in database");
        }
      })
      .then(() => {
        setLoaded(true);
      });
  }, []);

  const [deletingAccount, setDeletingAccount] = useState(false);
  function handleDeleteAccount() {
    authUser
      ?.delete()
      .then(() => {
        //Remove data in Firestore and disconnect socket
        console.log("Successfully deleted account");
        deleteDoc(doc(db, "accounts", authUser.uid));
        //Deletes data of the user's access to devices
        const roomRef = collection(db, "devices");
        getDocs(roomRef).then((roomSnapshot) => {
          roomSnapshot.forEach((room) => {
            deleteDoc(doc(db, "devices", room.id, "users", authUser.uid));
          });
        });
        //Deletes data of the user's report
        const reportRef = collection(db, "report", "user", authUser.uid);
        getDocs(reportRef).then((reportSnapshot) => {
          reportSnapshot.forEach((report) => {
            const picRef = doc(db, "devices", report.id);
            getDoc(picRef).then((picSnap) => {
              const pic = picSnap.data().pic;
              deleteDoc(doc(db, "report", "admin", pic, report.id));
            });
            deleteDoc(doc(db, "report", "user", authUser.uid, report.id));
          });
        });
        //Disconnect socket
        socket.disconnect();
      })
      .then(() => {
        //Finally go back to login page
        navigate("/");
      });
  }

  //Style copied from MUI Material Divider section
  const Root = styled("div")(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    "& > :not(style) ~ :not(style)": {
      marginTop: theme.spacing(2),
    },
  }));

  //Copy to clipboard snackbar
  const [copiedUID, setCopiedUID] = useState(false);
  function handleCloseSnackBar(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setCopiedUID(false);
  }

  return (
    <>
      <Box>
        <Toolbar>
          <Typography
            textAlign="center"
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, paddingLeft: 7 }}
          >
            Account Details
          </Typography>
          <IconButton aria-label="backToHomePage" onClick={prop.goBack}>
            <IoIosUndo size={30} />
          </IconButton>
        </Toolbar>
      </Box>
      <Box className="account-overview" display={"flex"}>
        {!loaded ? (
          <>
            <br />
            <LinearProgress />
          </>
        ) : (
          <>
            <Container>
              <Root>
                <Divider textAlign="center">Username</Divider>
                <Typography variant="h6" textAlign="center">
                  {authUser.displayName}
                </Typography>
                <Divider textAlign="center">UID</Divider>
                <Typography variant="h6" textAlign="center">
                  {authUser.uid}
                  <IconButton
                    onClick={() => {
                      setCopiedUID(true);
                      navigator.clipboard.writeText(authUser.uid);
                    }}
                    sx={{ translate: 10 }}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Divider textAlign="center">Access Role</Divider>
                <Typography variant="h6" textAlign="center">
                  {role}
                </Typography>
                <Divider textAlign="center">Email</Divider>
                <Typography variant="h6" textAlign="center">
                  {authUser.email}
                </Typography>
                {role === "administration" && (
                  <>
                    <Divider textAlign="center">Administration ID</Divider>
                    <Typography variant="h6" textAlign="center">
                      {id}
                    </Typography>
                  </>
                )}
              </Root>
              <Typography textAlign="center" sx={{ marginTop: 3 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeletingAccount(true)}
                >
                  Delete Account
                </Button>
              </Typography>
            </Container>
          </>
        )}
      </Box>
      {
        //Delete account dialog and Snackbar for copied UID
        <>
          <Dialog
            open={deletingAccount}
            onClose={() => setDeletingAccount(false)}
            aria-labelledby="delete-device-title"
            aria-describedby="delete-device-description"
          >
            <DialogTitle>Deleting Account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You are about to delete your account permanently, are you sure?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeletingAccount(false)}>Back</Button>
              <Button onClick={handleDeleteAccount}>Confirm</Button>
            </DialogActions>
          </Dialog>
          <Snackbar //Copied UID to clipboard
            open={copiedUID}
            autoHideDuration={2000}
            onClose={handleCloseSnackBar}
          >
            <Alert
              onClose={handleCloseSnackBar}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Copied UID to clipboard.
            </Alert>
          </Snackbar>
        </>
      }
    </>
  );
};

export default AccountPage;
