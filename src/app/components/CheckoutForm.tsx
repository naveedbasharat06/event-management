"use client";

import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/success`, // or your own route
      },
    });

    if (error) {
      console.error("Payment error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
