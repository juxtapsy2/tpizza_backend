import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    dishes: {
      type: [String],   // dish slugs
      required: true,
    },
    date: {
      type: Date,
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ongoing", "accomplished", "cancelled"],
      default: "ongoing",
    },
    rating: {
        type: Schema.Types.ObjectId,
        ref: "Rating",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);