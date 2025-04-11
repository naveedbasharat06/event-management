"use client";

import React, { useEffect, useState } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  ticketPrice: number;
  eventImage?: string;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [count, setCount] = useState(1);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/events/getEventById/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEvent(data.event);
      } catch (err) {
        setError("Failed to fetch event details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBuyTickets = async () => {
    if (!event) return;

    setIsProcessing(true);
    try {
      // Create checkout session
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              name: event.eventName,
              image_url: event.eventImage || "/default-event.jpg",
              price: event.ticketPrice,
              quantity: count,
              eventId: id,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { id: sessionId } = await response.json();
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error instanceof Error ? error.message : "Payment processing failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${
          event.eventImage || "/default-event.jpg"
        })`,
      }}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white/90 rounded-2xl p-6 md:p-8 text-black shadow-xl backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {event.eventName}
          </h1>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-line">
              {event.eventDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <p className="font-semibold">Date:</p>
              <p>
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="font-semibold">Location:</p>
              <p>{event.eventLocation}</p>
            </div>
            <div>
              <p className="font-semibold">Price per ticket:</p>
              <p>${event.ticketPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCount((prev) => Math.max(1, prev - 1))}
                disabled={count <= 1}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition disabled:opacity-50"
              >
                <Minus className="w-5 h-5 text-black" />
              </button>
              <span className="text-xl font-bold min-w-[2rem] text-center">
                {count}
              </span>
              <button
                onClick={() => setCount((prev) => prev + 1)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                <Plus className="w-5 h-5 text-black" />
              </button>
            </div>
            <p className="text-xl font-semibold">
              Total: ${(count * event.ticketPrice).toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleBuyTickets}
            disabled={isProcessing}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-lg font-semibold transition duration-200 flex items-center justify-center gap-2 ${
              isProcessing ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Processing...
              </>
            ) : (
              `Buy ${count} Ticket${count !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
