import {
  LiveKitRoom,
  DisplayContext,
} from "@livekit/react-components/dist/index";
import "@livekit/react-components/dist/index.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomLivekit.css"

const CustomLivekitComponent = () => {
  const url = "wss://video-app-18or3v8b.livekit.cloud";
  const [displayOptions, setDisplayOptions] = useState({
    stageLayout: "grid",
    showStats: false,
  });
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6Im15Um9vbSJ9LCJpYXQiOjE2OTE0ODU2MTcsIm5iZiI6MTY5MTQ4NTYxNywiZXhwIjoxNjkxNTA3MjE3LCJpc3MiOiJBUElNc3BCNFJTUHNzaVoiLCJzdWIiOiJwcmluY2UiLCJqdGkiOiJwcmluY2UifQ.-7UJ-73bW85muKS_iC3sy7rIndQmFXcKKi5v4OfxyiA");
  let name = "sunny";
//   const name = localStorage.getItem("name")

  // const token =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6Im15Um9vbSJ9LCJpYXQiOjE2OTExNzA0MDEsIm5iZiI6MTY5MTE3MDQwMSwiZXhwIjoxNjkxMTkyMDAxLCJpc3MiOiJBUElNc3BCNFJTUHNzaVoiLCJzdWIiOiJwcmluY2UiLCJqdGkiOiJwcmluY2UifQ.MiqH-Me8DP006xB_c7_ZAd7h3H90Bk0Vhbh-bb4JIc8";
//   useEffect(() => {
//     (async () => {
//       const resp = await axios.get(
//         `http://localhost:3005/getToken?name=${name}`
//       );
//       if (resp.status === 200) {
//         console.log(resp, "resp");
//         // callRoom(resp?.data);
//         setToken(resp?.data);
//       }
//       // setToken(tokenKey);
//       //   const data = await resp.json();
//     })();
//   }, []);
//   if (token === "") {
//     return <h1>Getting TOken..</h1>;
//   }
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>
      <DisplayContext.Provider value={displayOptions}>
        <div className="roomContainer">
          <LiveKitRoom
            url={url}
            token={token}
            onConnected={(room) => console.log(room)}
            onLeave={(room) => room.disconnect()}
          />
        </div>
      </DisplayContext.Provider>
    </div>
  );
};

export default CustomLivekitComponent;