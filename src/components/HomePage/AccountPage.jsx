import React, { useState, useEffect } from "react";
import { IoIosUndo } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { socket } from "../../socket";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const AccountPage = (prop) => {
  //For navigating to other pages
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(auth.currentUser);
  const [userDoc, setUserDoc] = useState(null);
  const [role, setRole] = useState("");
  const [id, setID] = useState("");

  useEffect(() => {
    console.log("Reading firestore");
    const userRef = doc(db, "accounts", authUser.uid);
    getDoc(userRef).then((userSnap) => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserDoc(userData);
        setRole(userData.role);
        setID(userData.id);
      } else {
        console.log("User doesnt exist in database");
      }
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
        socket.disconnect();
      })
      .then(() => {
        //Finally go back to login page
        navigate("/");
      });
  }

  return (
    <>
      <Box>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Account Details
          </Typography>
          <IconButton aria-label="backToHomePage" onClick={prop.goBack}>
            <IoIosUndo size={30} />
          </IconButton>
        </Toolbar>
      </Box>

      <div className="account-overview">
        Username: {authUser.displayName}
        <br />
        Email: {authUser.email}
        <br />
        Access Role: {role}
        <br />
        {role === "administration" && <div>ID: {id}</div>}
      </div>
      <Button
        variant="contained"
        color="error"
        onClick={() => setDeletingAccount(true)}
      >
        Delete Account
      </Button>
      {
        //Delete account dialog
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
      }
    </>
  );
};

export default AccountPage;
