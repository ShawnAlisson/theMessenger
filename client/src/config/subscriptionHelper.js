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
