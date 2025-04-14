"use client";

import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/success`, // Update for production
      },
    });

    if (error) {
      console.error("Payment error:", error.message);
    }
  };

  if (!isReady) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="animate-spin h-6 w-6 text-green-600" />
        <span className="ml-2 text-green-700">Loading payment form...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <PaymentElement />
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl text-lg font-semibold transition"
      >
        Pay Now
      </button>
    </form>
  );
}
