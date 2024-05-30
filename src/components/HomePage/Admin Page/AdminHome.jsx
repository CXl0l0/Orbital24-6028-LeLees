import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";

export const AdminHome = () => {
  const navigate = useNavigate();
  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
      })
      .then(() => navigate("/"));
  }
  return (
    <div>
      <h1>Admin Home</h1>
      Welcome, {auth.currentUser.displayName}!
      <br />
      <button onClick={userSignOut}>Sign out</button>
    </div>
  );
};
