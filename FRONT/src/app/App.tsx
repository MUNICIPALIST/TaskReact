// src/app/App.tsx
import React, { useState } from "react";
import LoginForm from "../shared/ui/LoginForm";
import HomePage from "../pages/HomePage/HomePage";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect login or password");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <HomePage />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-pink-200">
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
    </>
  );
};

export default App;
