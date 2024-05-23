import React from "react";
import { useState } from "react";

function HeaderIcon({ inactiveIcon, activeIcon }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <span onClick={() => setIsActive(!isActive)}>
      {isActive ? activeIcon : inactiveIcon}
    </span>
  );
}

export default HeaderIcon;
