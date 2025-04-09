"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Sonner toast import

const formSchema = z.object({
  eventName: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  eventDate: z.string().min(1, {
    message: "Please select a date and time.",
  }),
  eventLocation: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  eventDescription: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventDate: "",
      eventLocation: "",
      eventDescription: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post("http://localhost:3000/api/events/createEvent", values)
      .then((res) => {
        // console.log("Event created:", res.data);
        if (res.data.success) {
          toast.success("Event created successfully!");
          form.reset(); // Reset the form after successful submission
        }
        //else throw error
        else {
          throw new Error(res.data.message);
        }
      })
      .catch((err) => {
        // console.error("Error creating event:", err);
        toast.error(`${err}`); // Error toast from Sonner
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-200 px-4">
      <div className="w-full max-w-2xl bg-[#171717] p-8 rounded-2xl shadow-xl mt-20 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Create New Event
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">
                    Event Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Tech Conference 2025"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The title of your event.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">
                    Date and Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    When is your event happening?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Lahore Expo Center"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Where will the event be held?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">
                    Event Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Write a brief description of the event..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tell attendees what to expect.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center">
              <Button
                type="submit"
                className="px-6 py-3 text-white text-lg bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Create Event
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
