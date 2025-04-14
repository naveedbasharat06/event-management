"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import CheckoutForm from "./CheckoutForm"; // your form
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
    const opts: StripeElementsOptions = {
      clientSecret,
      appearance: {
        theme: "stripe",
      },
    };
    return opts;
  }, [clientSecret]);

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
