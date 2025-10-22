import React from "react";
import AuthForm from "../components/AuthForm";
import { signupUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();

  const handleSignup = async (formData) => {
    const data = await signupUser(formData);
    if (data.token) {
      login(data);
      window.location.href = "/";
    } else {
      alert(data.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f0f0f]">
      <AuthForm onSubmit={handleSignup} buttonText="Sign Up" isSignup={true} />
    </div>
  );
}
