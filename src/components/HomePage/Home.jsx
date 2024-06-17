import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginForm from "../auth/LoginPage/LoginForm";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import UserHome from "./User Page/UserHome";
import { AdminHome } from "./Admin Page/AdminHome";

function Home() {
  useEffect(() => {
    document.title = "Home";
  }, []);

  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);

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

  useEffect(() => {
    if (authUser) {
      getDoc(doc(db, "accounts", authUser.uid)).then((userSnap) => {
        setRole(userSnap.data().role);
      });
    }
  }, [authUser]);

  return authUser ? (
    role === "user" ? (
      <UserHome />
    ) : (
      <AdminHome />
    )
  ) : (
    <LoginForm />
  );
}

export default Home;
