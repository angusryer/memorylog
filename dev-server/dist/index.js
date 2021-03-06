"use strict";
 (() => new EventSource("/dev-server").onmessage = () => location.reload())();
(() => {
  // src/base/input.ts
  function input({ className = "" }) {
    const container = document.createElement("div");
    const input2 = document.createElement("input");
    input2.setAttribute("type", "text");
    className && input2.setAttribute("class", `${className}`);
    return container.appendChild(input2);
  }

  // src/app.ts
  var head = document.getElementsByTagName("head");
  var root = document.getElementById("root");
  var app = root == null ? void 0 : root.appendChild(input({ className: "memory" }));
})();
//# sourceMappingURL=index.js.map
