import { LiveKitRoom } from '@livekit/react-components';
// CSS should be explicitly imported if using the default UI
import '@livekit/react-components/dist/index.css';
// used by the default ParticipantView to maintain video aspect ratio.
// this CSS must be imported globally
// if you are using a custom Participant renderer, this import isn't necessary.
// import 'react-aspect-ratio/aspect-ratio.css';
import "./CustomLivekit.css"


const TestComponent = () => {
    const url = "wss://video-app-18or3v8b.livekit.cloud";
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6Im15Um9vbSJ9LCJpYXQiOjE2OTE0ODU2MTcsIm5iZiI6MTY5MTQ4NTYxNywiZXhwIjoxNjkxNTA3MjE3LCJpc3MiOiJBUElNc3BCNFJTUHNzaVoiLCJzdWIiOiJwcmluY2UiLCJqdGkiOiJwcmluY2UifQ.-7UJ-73bW85muKS_iC3sy7rIndQmFXcKKi5v4OfxyiA"
    async function onConnected(room) {
      await room.localParticipant.setCameraEnabled(true);
      await room.localParticipant.setMicrophoneEnabled(true);
    }
    return (
      <div className="roomContainer">
        <LiveKitRoom url={url} token={token} onConnected={(room) => onConnected(room)} />
      </div>
    );
}

export default TestComponent