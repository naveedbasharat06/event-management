// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      if (response.data.success) {
        alert(
          "Signup successful! Please check your email to verify your account."
        );
        setUser({ username: "", email: "", password: "" });
        router.push("/login");
      }
      alert(response.data.message);
    } catch (error) {
      alert("Signup failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-200 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#171717] rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-white text-center">Sign Up</h2>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            required
            id="name"
            placeholder="Enter your name"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            required
            id="email"
            type="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            required
            id="password"
            type="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>
          <Link href="/login">
            <Button
              variant="link"
              className="text-blue-500 hover:underline p-0 h-auto cursor-pointer"
            >
              Login
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
