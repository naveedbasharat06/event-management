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

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/events/getEvent")
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
          layout="fill"
          objectFit="cover"
          className="opacity-25"
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
                  <Card className="bg-white/90 hover:scale-[1.02] transition-transform shadow-xl rounded-2xl">
                    <CardContent className="p-6 space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {event.eventName}
                      </h2>
                      <p className="text-sm text-gray-600">
                        📅 {new Date(event.eventDate).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {event.eventLocation}
                      </p>
                      <p className="text-gray-700 text-sm">
                        {event.eventDescription}
                      </p>
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

      {/* <footer className="text-white text-sm mt-10 z-10">
        &copy; {new Date().getFullYear()} Eventify. All rights reserved.
      </footer> */}
    </div>
  );
}
