"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Event type
type Event = {
  _id: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
};

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/events/getEvent")
      .then((res) => {
        setEvents(res.data.allEvents);
        setLoading(false);
      })

      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-200 p-6 flex justify-center items-start">
      <Card className="w-full max-w-6xl shadow-xl border-0 mt-20 bg-[#171717]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            All Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500">No events found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell className="font-medium">
                      {event.eventName}
                    </TableCell>
                    <TableCell>
                      {new Date(event.eventDate).toLocaleString()}
                    </TableCell>
                    <TableCell>{event.eventLocation}</TableCell>
                    <TableCell>{event.eventDescription}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
