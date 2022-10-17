//TODO: WEB PUSH NOTIFICATION
// import axios from "axios";
// async function regSw() {
//   if ("serviceWorker" in navigator) {
//     let url = process.env.PUBLIC_URL + "/sw.js";
//     const reg = await navigator.serviceWorker.register(url, { scope: "/" });
//     console.log("service config is", { reg });
//     return reg;
//   }
//   throw Error("serviceworker not supported");
// }

// async function subscribe(serviceWorkerReg) {
//   let subscription = await serviceWorkerReg.pushManager.getSubscription();
//   if (subscription === null) {
//     subscription = await serviceWorkerReg.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey:
//         "BKnlgSAc5m6vdHuNUEHaEtdLma0dCZjjUJyg5hs32QNARh_zxaoFpDXlKxagiZJ60M6-bqa9D0roADIXuvzlCas",
//     });
//     const config = {
//       baseURL: process.env.REACT_APP_SERVER_URL,
//     };
//     axios.post("/subscribe", subscription, config);
//   }
// }

// export { regSw, subscribe };

// export default function checkPageStatus(message) {
//   // if (user !== localStorage.getItem("userInfo")) {
//   if (!("Notification" in window)) {
//     console.log("sss");
//     alert("This browser does not support system notifications!");
//   } else if (Notification.permission === "default") {
//     sendNotification(message);
//     console.log("tried");
//   } else if (Notification.permission === "granted") {
//     console.log("tried");
//     sendNotification(message);
//   } else if (Notification.permission !== "denied") {
//     Notification.requestPermission((permission) => {
//       if (permission === "granted") {
//         sendNotification(message);
//         console.log("tried");
//       }
//     });
//   }
// }
// }

// function sendNotification(message, user) {
//   const notification = new Notification("New message from Open Chat", {
//     icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
//     body: `@${user}: ${message}`,
//   });
//   notification.onclick = () =>
//     function () {
//       window.open("http://localhost:3000/chat");
//     };
// }

// function sendNotification(message, user) {
//   document.onvisibilitychange = () => {
//     if (document.hidden) {
//       const notification = new Notification("New message from Open Chat", {
//         icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
//         body: `@${user}: ${message}`,
//       });
//       notification.onclick = () =>
//         function () {
//           window.open("http://localhost:3000/chat");
//         };
//     }
//   };
// }

// function sendNotification(message) {
// document.onvisibilitychange = () => {
//   if (document.hidden) {
//   const notification = new Notification("New message from Open Chat", {
//     icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
//     body: ` ${message}`,
//   });
//   notification.onclick = () =>
//     function () {
//       window.open("http://localhost:3000/chat");
//     };
// }
//   };
// }
