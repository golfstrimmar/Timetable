import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    content: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true } // автоматически добавит createdAt и updatedAt
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
