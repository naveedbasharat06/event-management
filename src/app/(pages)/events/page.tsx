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
import { Button } from "@/components/ui/button";

type Event = {
  _id: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  ticketPrice: string; // ✅ Added price
};

const ITEMS_PER_PAGE = 5;

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get("/api/events/getEvent")
      .then((res) => {
        setEvents(res.data.allEvents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const paginatedEvents = events.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-200 p-6 flex justify-center items-start">
      <Card className="w-full max-w-6xl shadow-xl border-0 mt-20 bg-[#171717] ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
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
            <p className="text-center text-gray-400">No events found.</p>
          ) : (
            <>
              <div className="max-h-[500px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEvents.map((event) => (
                      <TableRow key={event._id}>
                        <TableCell className="font-medium text-white">
                          {event.eventName}
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(event.eventDate).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-white">
                          {event.eventLocation}
                        </TableCell>
                        <TableCell className="text-white">
                          {event.ticketPrice}
                        </TableCell>
                        <TableCell className="text-white max-w-[200px] whitespace-normal break-words">
                          {event.eventDescription}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination controls */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-white">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
