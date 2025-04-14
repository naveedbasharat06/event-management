"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  ticketPrice: number;
  eventImage: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/events/getEvent")
      .then((res) => setEvents(res.data.allEvents))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6 sm:p-20 font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/event-bg.jpg"
          alt="Event background"
          fill
          sizes="100vw"
          className="opacity-25 object-cover"
          priority={true} // Only include if this is above-the-fold
        />
      </div>

      <main className="w-full max-w-6xl text-white text-center flex flex-col items-center gap-10">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Upcoming Events
        </motion.h1>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Carousel>
            <CarouselContent>
              {events.map((event) => (
                <CarouselItem
                  key={event._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="bg-white/90 hover:scale-[1.02] transition-transform shadow-xl rounded-2xl overflow-hidden relative m-2">
                    {/* Event Image */}
                    <div className="absolute h-60 w-full top-0">
                      <Image
                        src={event.eventImage}
                        alt={event.eventName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded-t-2xl object-cover"
                        priority={true} // Add this if the image is above the fold
                      />
                    </div>

                    <CardContent className="p-6 space-y-2 text-left relative pt-60">
                      <h2 className="text-xl font-bold text-gray-900">
                        {event.eventName}
                      </h2>
                      <p className="text-sm text-gray-600">
                        📅 {new Date(event.eventDate).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {event.eventLocation}
                      </p>

                      <p
                        className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal "
                        title={event.eventDescription}
                      >
                        {event.eventDescription}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 pt-2">
                        🎟️ Ticket Price: ${event.ticketPrice}
                      </p>
                      <Button
                        onClick={() => router.push(`/events/${event._id}`)}
                        className="bg-blue-600 text-white hover:bg-blue-700 mt-3"
                      >
                        Buy Ticket
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.div>
      </main>
    </div>
  );
}
