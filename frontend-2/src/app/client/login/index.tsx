"use client";

import { useState } from "react";
import Link from "next/link";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //   const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // try {
    //   // Call backend API to create a new user
    //   const response = await fetch("/api/signup", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ Username: username, Password: password }),
    //   });

    //   const result = await response.json();

    //   if (response.ok) {
    localStorage.setItem("username", username);
    window.location.href = "/user-application"; // Redirect to User Application Page
    //   } else {
    //     setError(result.error || "Failed to sign up");
    //   }
    // } catch (err) {
    //   setError("An error occurred");
    // }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-lg border p-6 shadow-md">
      <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-10">
        <div className="w-full">
          <label htmlFor="username" className="mb-1 block w-full font-medium">
            Username*
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full cursor-pointer rounded border border-[#cadcfc] p-2"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="mb-1 block font-medium">
            Password*
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!username}
            required
            className="w-full cursor-pointer rounded border border-[#cadcfc] p-2"
          />
        </div>

        {/* {error && <div className="text-sm text-red-500">{error}</div>} */}
        <button
          type="submit"
          className="h-10 w-full rounded-xl bg-[#00246b] p-2 text-[#cadcfc] hover:bg-[#cadcfc] hover:text-[#00246b]"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600">
        {`Don't have an account?`}
        {""}
        <Link
          href="/sign-up"
          className="font-semibold text-[#00246b] hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
