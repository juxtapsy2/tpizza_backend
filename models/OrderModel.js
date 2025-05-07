import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    orderCode: { type: String, required: true, unique: true },  // short code for later research
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    dishes: [
      {
        slug: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      }
    ],
    date: {
      type: Date,
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "momo"],
      required: true,
    },
    status: {
      type: String,
      enum: ["processing", "cooking", "ongoing", "accomplished", "cancelled"],
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