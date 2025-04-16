import mongoose from "mongoose";
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    details: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["activating", "disabled"],
      default: "disabled",
    },
  },
  { timestamps: true }
);

// Utility to convert name to slug
const generateSlug = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-") // replace spaces & special chars with hyphen
      .replace(/^-+|-+$/g, "");  // remove leading/trailing hyphens

// Pre-save hook to auto-generate slug
EventSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  const baseSlug = generateSlug(this.name);
  let slug = baseSlug;
  let counter = 1;

  // Ensure slug is unique
  while (await mongoose.models.Event.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  this.slug = slug;
  next();
});

export default mongoose.model("Event", EventSchema);
