// Memory Log
// Need inputs for:
// 1. Today's date
// 2. Best moment
// 3. Biggest win
// Submit button
// Display table with all others from DB

import "./style/global.css";
import { input } from "./base/input/input";

const root = document.getElementById("root");
root?.appendChild(input({ className: "memory" }));

export {};
