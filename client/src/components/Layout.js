import React from "react";
import Switch from "@material-ui/core/Switch";
import { useTheme } from "@material-ui/styles";

export default function Layout({
  children,
  toggleMode,
  state,
  toggleDarkMode
}) {
  const theme = useTheme();

  return (
    <div style={{ color: theme.palette.type === "light" ? "black" : "white" }}>
      <Switch onChange={toggleDarkMode} />
      {children}
    </div>
  );
}
