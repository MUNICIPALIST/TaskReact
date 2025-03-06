// src/shared/ui/LoginForm.tsx
import React, { FC, useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: FC<LoginFormProps> = ({ onLogin }) => {
  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handleSubmit = () => {
    onLogin(loginInput, passwordInput);
  };

  return (
    <div className="bg-white/90 p-6 rounded-xl shadow-md w-80 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-gray-700 text-center">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={loginInput}
        onChange={(e) => setLoginInput(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        className="border rounded p-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign In
      </button>
    </div>
  );
};

export default LoginForm;
