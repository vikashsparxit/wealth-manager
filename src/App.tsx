import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Login from "./pages/Login";
import Setup from "./pages/Setup";
import Index from "./pages/Index";
import "./App.css";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/" element={<Index />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;