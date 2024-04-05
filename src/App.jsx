import './App.css';
import { setup } from "@loomhq/record-sdk";
import { isSupported } from "@loomhq/record-sdk/is-supported";
import { oembed } from "@loomhq/loom-embed";
import { useEffect, useState } from "react";

const queryParams = new URLSearchParams(window.location.search);
const PUBLIC_APP_ID = queryParams.get("public_app_id");
const BUTTON_ID = "loom-record-sdk-button";

function App() {
  const [videoHTML, setVideoHTML] = useState("");

  useEffect(() => {
    async function setupLoom() {
      const { supported, error } = await isSupported();

      if (!supported) {
        console.warn(`Error setting up Loom: ${error}`);
        return;
      }

      const button = document.getElementById(BUTTON_ID);

      if (!button) {
        return;
      }

      console.log("PUBLIC_APP_ID: ", PUBLIC_APP_ID);

      const serverJws = JSON.parse(await (await fetch("https://0sh3wj6bh0.execute-api.us-east-1.amazonaws.com/test/request-jwt", {
        method: 'POST',
        body: JSON.stringify({
          public_app_id: PUBLIC_APP_ID
        })
      })).text()).body

      console.log("serverJws: ", serverJws);

      const { configureButton } = await setup({
        jws: JSON.parse(serverJws),
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.on("insert-click", async (video) => {
        console.log({message: "Hello, world!"});
        const { html } = await oembed(video.sharedUrl, { width: 10, height: 10 });
        setVideoHTML(html);
      });
    }

    setupLoom();
  }, []);

  return (
    <>
      <button id={BUTTON_ID}>Record</button>
    </>
  );
}

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
