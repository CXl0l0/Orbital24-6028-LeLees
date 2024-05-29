import React, { useEffect } from "react";
import AuthDetails from "../auth/AuthDetails";
import { Box, TextField } from "@mui/material";

function Home() {
  useEffect(() => {
    document.title = "Home";
  });

  return (
    <>
      <AuthDetails />
    </>
  );
}

export default Home;
