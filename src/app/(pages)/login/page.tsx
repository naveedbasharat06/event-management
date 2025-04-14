"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("api/users/login", user);

      if (response.data.success) {
        toast.success(response.data.message);
        const token = response.data.token;
        const expiryTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiry", expiryTime.toString());
        window.dispatchEvent(new Event("userLoggedIn"));

        router.push("/");
      }
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-200 flex justify-center items-center p-6">
      <form
        onSubmit={handleLogin}
        className="bg-[#171717] rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-white text-center">Log In</h2>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?
          </p>
          <Link href="/signup">
            <Button
              variant="link"
              className="text-blue-500 hover:underline p-0 h-auto cursor-pointer"
            >
              Create an account
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
