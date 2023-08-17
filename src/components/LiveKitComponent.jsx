import React from "react";
import {
    LiveKitRoom,
    DisplayContext,
  } from "@livekit/react-components/dist/index";
  import "@livekit/react-components/dist/index.css"

  import axios from "axios";
  import "./CustomLivekit.css"
const LiveKitComponent = () => {
    const url = "wss://video-app-18or3v8b.livekit.cloud";
    // const [displayOptions, setDisplayOptions] = useState({
    //   stageLayout: "grid",
    //   showStats: false,
    // });
    // const [token, setToken] = useState("");
    let name = "sunny";
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6e…1ZyJ9.Zw6fJ1A8yt-ejRa2VQYPLM2W_2rbs8bcbLCletWxbaI"

    return (
        <div>
                    {token.length > 0 ? 
                    // <h1>hrigj</h1>
          <DisplayContext.Provider >
            <div className="roomContainer">
              <LiveKitRoom
                url={url}
                token={token}
                onConnected={(room) => console.log(room)}
                onLeave={(room) => room.disconnect()}
              />
             </div>
          </DisplayContext.Provider>
                :<h1>No TOken Found</h1>  }
        </div>
      );
}

export default LiveKitComponent