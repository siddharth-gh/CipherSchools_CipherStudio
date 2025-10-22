import React from "react";
import AuthForm from "../components/AuthForm";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const handleLogin = async (formData) => {
    const data = await loginUser(formData);
    if (data.token) {
      login(data);
      window.location.href = "/";
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f0f0f]">
      <AuthForm onSubmit={handleLogin} buttonText="Login" />
    </div>
  );
}
