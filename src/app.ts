// Memory Log
// Need inputs for:
// 1. Today's date
// 2. Best moment
// 3. Biggest win
// Submit button
// Display table with all others from DB

import "./style/global.css";
import { input } from "./base/input";

const head = document.getElementsByTagName("head");
// do stuff with head

const root = document.getElementById("root");
const app = root?.appendChild(input({ className: "memory" }));

export { app };
