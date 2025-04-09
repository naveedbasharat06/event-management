import mongoose from "mongoose";
const createEventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },
    //   eventImage: {
    //     type: String,
    //     required: true,
    //   },
  },
  { timestamps: true }
);

const CreateEvent =
  mongoose.models.CreateEvent ||
  mongoose.model("CreateEvent", createEventSchema);
export default CreateEvent;
