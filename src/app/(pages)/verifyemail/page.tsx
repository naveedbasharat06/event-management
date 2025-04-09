"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error?.response?.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Verify Email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <p className="text-sm text-muted-foreground  break-words w-full text-center">
            {token ? `Token: ${token}` : "No token provided"}
          </p>

          {verified && (
            <Alert className="bg-green-100 border-green-500 text-green-800">
              <AlertTitle>Email Verified!</AlertTitle>
              <AlertDescription>
                Your email has been successfully verified.
              </AlertDescription>
              <Link href="/login">
                <Button className="mt-4">Go to Login</Button>
              </Link>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                Something went wrong during verification.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
