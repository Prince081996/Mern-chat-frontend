import { Button } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import { PrivateRoute } from "./routes/Routes";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact={true} />
      <PrivateRoute path="/chats" component={ChatPage} exact={true} />
    </div>
  );
}

export default App;
