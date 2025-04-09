"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post(
          "/api/users/me",
          {},
          { withCredentials: true }
        );

        if (res.data.success) {
          setUsername(res.data.user.username);
        } else {
          setUsername("");
        }
      } catch (err) {
        console.error("Error fetching user", err);
        setUsername("");
      }
    };

    // Fetch user data when component mounts
    fetchUser();

    // Listen for login/logout events
    const handleAuthChange = () => fetchUser();
    window.addEventListener("userLoggedIn", handleAuthChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      setUsername("");
      window.dispatchEvent(new Event("userLoggedIn")); // To trigger re-check
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black shadow-sm z-50">
      <div className="mx-auto flex items-center justify-between px-6 py-4 max-w-7xl">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          EventHub
        </Link>

        <div className="pr-10 flex items-center gap-6">
          <nav className="flex gap-6 items-center">
            <Link href="/events" className="text-sm hover:text-blue-500">
              Events
            </Link>
            <Link href="/createEvent" className="text-sm hover:text-blue-500">
              Create
            </Link>
          </nav>

          {username ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
