"use client";

import Link from "next/link";
import Image from "next/image";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/success.svg" // optional: add a confetti or success SVG in public/
            alt="Success"
            width={100}
            height={100}
          />
        </div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for purchasing tickets. A confirmation email has been sent
          to your inbox.
        </p>
        <Link
          href="/events"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition"
        >
          Browse More Events
        </Link>
      </div>
    </div>
  );
}
