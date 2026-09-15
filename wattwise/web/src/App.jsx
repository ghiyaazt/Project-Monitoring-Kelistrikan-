import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("landing"); // "landing" | "login"

  if (!isLoggedIn) {
    if (view === "landing") {
      return <Landing onGetStarted={() => setView("login")} />;
    }
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Dashboard />;
}

export default App;
