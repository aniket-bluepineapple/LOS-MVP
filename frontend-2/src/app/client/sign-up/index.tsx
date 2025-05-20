"use client";

import { useState } from "react";
import Link from "next/link";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Password validation function
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasDigit = /\d/.test(password);

    if (!minLength || !hasUpperCase || !hasSpecialChar || !hasDigit) {
      setPasswordError(
        "Password must be at least 8 characters long, include 1 uppercase letter, 1 special character, and 1 number."
      );
      return false;
    }

    setPasswordError(""); // Clear error if valid
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) return;

    try {
      // Call backend API to create a new user
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Sign-up successful! Redirecting to login...");
        window.location.href = "/login"; // Redirect to login page
      } else {
        setError(result.error ?? "Failed to sign up");
      }
    } catch (error) {
      console.log(error)
      setError("An error occurred");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md w-full rounded-lg border p-6 shadow-md">
      <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-10">
        <div className="w-full">
          <label htmlFor="username" className="block font-medium mb-1 w-full">
            Username*
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="cursor-pointer rounded border border-[#cadcfc] p-2 w-full"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="block font-medium mb-1">
            Password*
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validatePassword(password)}
            disabled={!username}
            required
            className={`cursor-pointer rounded border p-2 w-full ${
              passwordError ? "border-red-500" : "border-[#cadcfc]"
            }`}
          />
          {passwordError && <div className="w-full mt-2 text-justify text-[12px] text-red-500">{passwordError}</div>}
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
          type="submit"
          className="h-10 w-full rounded-xl bg-[#00246b] p-2 text-[#cadcfc] hover:bg-[#cadcfc] hover:text-[#00246b]"
        >
          Sign Up
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600">
        Already signed up?{" "}
        <Link href="/login" className="text-[#00246b] font-semibold hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
