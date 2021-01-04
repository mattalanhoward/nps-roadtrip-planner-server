// models/Parks.js

const { Schema, model } = require("mongoose");

const parksSchema = new Schema(
  {
    park: {
      type: Object,
    },
    usersFavorited: [{ type: Schema.Types.ObjectId, ref: "User" }],
    userRoadTrips: [{ type: Schema.Types.ObjectId, ref: "RoadTrips" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Parks", parksSchema);
