import cloudinary from "../config/cloudinary.js";
import { Booking } from "../models/Booking.js";
import { Restaurant } from "../models/Restaurant.js";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Cloudinary upload timed out after 15s"));
    }, 15000);

    const stream = cloudinary.uploader.upload_stream(
      { folder: "DineSpot" },
      (err, res) => {
        clearTimeout(timeout);
        if (err) return reject(err);
        if (!res) return reject(new Error("Upload failed."));
        resolve({ secure_url: res.secure_url });
      }
    );
    stream.end(fileBuffer);
  });
};

export const getOwnerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(400).json({ message: "No restaurant found" });
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const createOwnerRestaurant = async (req, res) => {
  try {
    const existing = await Restaurant.findOne({ owner: req.user._id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already have a restaurant registered." });
    }
    const {
      name,
      description,
      address,
      phone,
      cuisine,
      priceRange,
      chef,
      location,
      tags,
      availableSlots,
      totalSeats,
      image,
    } = req.body;
    if (
      !name ||
      !description ||
      !cuisine ||
      !priceRange ||
      !location ||
      !address ||
      !chef
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slugExist = await Restaurant.findOne({ slug });
    if (slugExist) {
      return res
        .status(400)
        .json({ message: "A restaurant with this name already exists." });
    }

    let imgUrl = "";
    if (req.file) {
      // handle img upload
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        imgUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary Error:", error);
        console.error("Message:", error.message);
        console.error("HTTP Code:", error.http_code);
        console.error("Error Details:", error.error);
        return res.status(400).json({ message: error.message });
      }
    }

    const parsedTags =
      typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : [];

    const parseSlots =
      typeof availableSlots === "string"
        ? availableSlots.split(",").map((s) => s.trim())
        : ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
    const restaurant = await Restaurant.create({
      name,
      slug,
      description,
      cuisine: cuisine.toLowerCase(),
      priceRange,
      location,
      address,
      chef,
      image: imgUrl,
      tags: parsedTags,
      availableSlots: parseSlots,
      totalSeats: totalSeats ? Number(totalSeats) : 20,
      owner: req.user._id,
      status: "pending",
    });

    return res.status(201).json(restaurant);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateOwnerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const {
      name,
      description,
      address,
      phone,
      cuisine,
      priceRange,
      chef,
      location,
      tags,
      availableSlots,
      totalSeats,
      image,
    } = req.body;

    if (name) {
      restaurant.name = name;
      restaurant.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (description) restaurant.description = description;
    if (cuisine) restaurant.cuisine = cuisine;
    if (location) restaurant.location = location;
    if (priceRange) restaurant.priceRange = priceRange;
    if (address) restaurant.address = address;
    if (chef) restaurant.chef = chef;
    if (totalSeats) restaurant.totalSeats = Number(totalSeats);
    if (tags) {
      restaurant.tags =
        typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;
    }

    if (availableSlots) {
      restaurant.availableSlots =
        typeof availableSlots === "string"
          ? availableSlots.split(",").map((s) => s.trim())
          : availableSlots;
    }

    if (req.file) {
      // handle img upload
      const result = await uploadToCloudinary(req.file.buffer);
      restaurant.image = result.secure_url;
    }

    const updated = await restaurant.save();
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const bookings = await Booking.find({
      restaurant: restaurant._id,
    })
      .populate("user", "name email phone")
      .sort({ date: -1, time: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["confirmed", "cancelled", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Please enter valid booking status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    const restaurant = await Restaurant.findById(booking.restaurant);
    if (
      !restaurant ||
      restaurant.owner.toString() !== req.user._id.toString()
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to manage this booking." });
    }

    booking.status = status;
    await booking.save();
    return res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};
