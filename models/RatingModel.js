import mongoose from "mongoose";
const { Schema } = mongoose;

const RatingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
    descriptionImage: {
        type: [String],
        default: [],
    }
  },
  { timestamps: true }
);

RatingSchema.index({ userId: 1, orderId: 1 }, { unique: true });

export default mongoose.model("Rating", RatingSchema);
