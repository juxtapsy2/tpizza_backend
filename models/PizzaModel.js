import mongoose from "mongoose";
const { Schema } = mongoose;

const PizzaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    detailImage: {
        type: String,
        required: true,
    },
    description: {
      type: String,
      default: "",
    },
    class: {
      type: [String],
    },
    size: {
      type: Number,
      enum: [7, 9, 12], // inches
      default: 7,
    },
    crustStyle: {
      type: String,
      enum: ["Thin", "Regular", "Thick", "Deep", "Stuffed"],
      default: "Thin",
    },
    toppings: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["enabled", "disabled"],
      default: "disabled",
    },
  },
  { timestamps: true }
);

const generateSlug = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-") // replace spaces & non-alphanumerics with hyphen
      .replace(/^-+|-+$/g, "");  // trim hyphens from start/end

// Auto-generate slug before saving
PizzaSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const baseSlug = generateSlug(this.title);
  let slug = baseSlug;
  let counter = 1;

  // Ensure the slug is unique in the "Pizza" collection
  while (await mongoose.models.Pizza.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  this.slug = slug;
  next();
});

export default mongoose.model("Pizza", PizzaSchema);
