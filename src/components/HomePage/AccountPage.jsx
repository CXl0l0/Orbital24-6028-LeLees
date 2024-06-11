import React, { useState, useEffect } from "react";
import { IoIosUndo } from "react-icons/io";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AccountPage = (prop) => {
  const authUser = auth.currentUser;
  const userRef = doc(db, "accounts", authUser.uid);
  const [userDoc, setUserDoc] = useState(null);
  const [role, setRole] = useState("");
  const [id, setID] = useState("");

  useEffect(() => {
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
  });

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
        ID: {id}
      </div>
    </>
  );
};

export default AccountPage;
