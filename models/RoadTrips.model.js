// models/RoadTrips.model.js

const { Schema, model } = require("mongoose");

const RoadTripsSchema = new Schema(
  {
    name: {
      type: String,
    },
    rating: {
      type: Number,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    parks: [],
  },
  {
    timestamps: true,
  }
);

module.exports = model("RoadTrips", RoadTripsSchema);
