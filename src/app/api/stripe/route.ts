// /pages/api/create-payment-intent.ts

// src/app/api/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// /api/stripe/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const totalAmount = body.items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
