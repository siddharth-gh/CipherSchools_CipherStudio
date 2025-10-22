import React, { useState } from "react";

const AuthForm = ({ onSubmit, buttonText, isSignup }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1e1e1e] text-white p-6 rounded-xl w-80 shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isSignup ? "Create an Account" : "Welcome Back"}
      </h2>

      {isSignup && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 rounded bg-[#2a2a2a] outline-none"
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 rounded bg-[#2a2a2a] outline-none"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 rounded bg-[#2a2a2a] outline-none"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default AuthForm;
