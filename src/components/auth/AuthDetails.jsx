//Reference from https://www.youtube.com/watch?v=Vv_Oi7zPPTw

import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
      })
      .then(() => navigate("/"));
  }

  return (
    <div>
      {authUser ? (
        <p>
          Welcome to urusai! {authUser.email} <br />
          <button onClick={userSignOut}>Sign out</button>
        </p>
      ) : (
        <p>You are signed out</p>
      )}
    </div>
  );
};

export default AuthDetails;
