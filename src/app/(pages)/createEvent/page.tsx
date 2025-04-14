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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  eventName: z
    .string()
    .min(2, { message: "Event name must be at least 2 characters." })
    .max(100, { message: "Event name must be less than 100 characters." }),
  eventDate: z.string().min(1, { message: "Please select a date and time." }),
  eventLocation: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." })
    .max(200, { message: "Location must be less than 200 characters." }),
  eventDescription: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description must be less than 1000 characters." }),
  ticketPrice: z.coerce
    .number()
    .min(0, { message: "Ticket price must be a non-negative number." })
    .max(10000, { message: "Ticket price must be less than $10,000." }),
  eventImage: z.string().url({ message: "Please upload a valid image." }),
});

export default function EventCreationForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setIsAdmin(false);

      const decoded: any = jwtDecode(token);
      if (decoded?.isadmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setIsAdmin(false);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventDate: "",
      eventLocation: "",
      eventDescription: "",
      ticketPrice: 0,
      eventImage: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/events/createEvent", values);

      if (response.data.success) {
        toast.success("Event created successfully!", {
          description: `"${values.eventName}" has been created.`,
        });
        form.reset();
      } else {
        throw new Error(response.data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        form.setValue("eventImage", data.secure_url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Failed to get image URL");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
      form.setValue("eventImage", "");
    } finally {
      setIsUploading(false);
    }
  };

  // Conditional rendering for admin access
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-semibold text-red-800">
          Access Denied: Admins only.
        </h2>
      </div>
    );
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
                      className="resize-none rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                      placeholder="Write a brief description of the event..."
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

            <FormField
              control={form.control}
              name="ticketPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">
                    Ticket Price ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Set a price for event entry.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">
                    Event Image
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading || isSubmitting}
                      />
                      {isUploading && (
                        <div className="flex items-center text-sm text-blue-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading image...
                        </div>
                      )}
                      {field.value && !isUploading && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-500">
                            ✓ Image uploaded
                          </span>
                          {!isSubmitting && (
                            <button
                              type="button"
                              onClick={() => form.setValue("eventImage", "")}
                              className="text-sm text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a high-quality image (JPEG/PNG, max 5MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2 text-center">
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto px-8 text-lg"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
