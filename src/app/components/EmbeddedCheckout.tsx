"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import CheckoutForm from "./CheckoutForm";
import type { StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function EmbeddedCheckout({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const options = useMemo(() => {
    return {
      clientSecret,
      appearance: { theme: "stripe" },
    } satisfies StripeElementsOptions;
  }, [clientSecret]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center p-10">
        <span className="text-green-600">Loading payment details...</span>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
