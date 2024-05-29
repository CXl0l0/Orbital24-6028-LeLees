import React, { useEffect } from "react";
import AuthDetails from "../auth/AuthDetails";

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
