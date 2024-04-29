import './App.css';
import { setup } from "@loomhq/record-sdk";
import { isSupported } from "@loomhq/record-sdk/is-supported";
import { useEffect, useState } from "react";

const queryParams = new URLSearchParams(window.location.search);
const PUBLIC_APP_ID = queryParams.get("public_app_id");

const BUTTON_ID = "loom-record-sdk-button";
const LINK_ID = "loom-share-link"
const LINK_COPY_ID = "loom-share-link-copy-to-clip-board"

function App() {
  const [link, setLink] = useState("");
  const [icon, setIcon] = useState("content_copy"); // true for IconBeforeClick, false for IconAfterClick

  async function handleCopyLink() {
    await navigator.clipboard.writeText(link);
    setIcon("done");
  }

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

      const serverJws = JSON.parse(JSON.parse(await (await fetch("https://0sh3wj6bh0.execute-api.us-east-1.amazonaws.com/test/request-jwt", {
        method: 'POST',
        body: JSON.stringify({
          public_app_id: PUBLIC_APP_ID
        })
      })).text()).body);

      const { configureButton } = await setup({
        jws: serverJws,
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.on("insert-click", async (video) => {
        document.documentElement.setAttribute("loomLink", video.sharedUrl); // Custom attribute
        console.log("iFrame: set the attribute 'loomLink' to '" + video.sharedUrl + "'.")
        setLink(video.sharedUrl);
        setIcon("content_copy");
      });
    }

    setupLoom();
  }, []);

  return (
    <>
      <button id={BUTTON_ID}>Record</button>
      {link && <div style={{backgroundColor: "#303030", marginTop: "10px", borderRadius: "10px", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "center"}} id={LINK_ID}>
        Copy Loom Link
        <button onClick={handleCopyLink} style={{marginLeft: "10px", backgroundColor: "#474747", borderRadius: "10px", padding: "0px 8px"}} id={LINK_COPY_ID}>
          <span className="material-icons" style={{ marginTop: "5px" }}>{icon}</span>
        </button>
      </div>}
    </>
  );
}

export default App
