import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AttendanceSheetPrototype from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AttendanceSheetPrototype />
  </StrictMode>,
);
