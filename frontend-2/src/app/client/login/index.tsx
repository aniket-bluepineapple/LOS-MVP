"use client";

import { useState } from "react";
import Link from "next/link";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem("username", username);
    window.location.href = "/user-application"; // Redirect to User Application Page
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
