import React from "react";
import { useState } from "react";

function HeaderIcon({ inactiveIcon, activeIcon, doThis }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <i
      onClick={() => {
        setIsActive(!isActive);
        doThis();
      }}
    >
      {isActive ? activeIcon : inactiveIcon}
    </i>
  );
}

export default HeaderIcon;
