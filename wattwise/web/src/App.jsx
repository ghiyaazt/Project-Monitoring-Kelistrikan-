import { useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Dashboard />;
}

export default App;
