import { Restaurant } from "../models/Restaurant.js";
import jwt from "jsonwebtoken";
import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";

export const getRestaurants = async (req, res) => {
  try {
    const { search, priceRange, rating, location, sort } = req.query;

    const queryObj = { status: "approved" };
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (priceRange) {
      const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
      queryObj.priceRange = { $in: prices };
    }
    if (rating) {
      queryObj.rating = { $gte: parseFloat(rating) };
    }
    if (location) {
      queryObj.location = { $regex: location, $options: "i" };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "rating") {
      sortOptions = { rating: -1 };
    } else if (sort === "price_low") {
      sortOptions = { priceRange: 1 };
    } else if (sort === "price_high") {
      sortOptions = { priceRange: -1 };
    }

    const restaurants = await Restaurant.find(queryObj).sort(sortOptions);
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getFeaturedRestaurants = async (req, res) => {
  try {
    const featured = await Restaurant.find({
      status: "approved",
      $or: [{ featured: true }, { exclusive: true }],
    }).limit(6);
    return res.status(200).json(featured);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getRestaurantBySlug = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    if (restaurant.status !== "approved") {
      let isAuthorized = false;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        try {
          const token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          const user = await User.findById(decoded.id).select("-password");
          if (
            user &&
            (user.role === "admin" ||
              (user.role === "owner" &&
                restaurant.owner.toString() === user._id.toString()))
          ) {
            isAuthorized = true;
          }
        } catch (error) {
          isAuthorized = false;
        }
      }
      if (!isAuthorized) {
        return res
          .status(404)
          .json({ message: "Restaurant not found or pending approval." });
      }
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getRestaurantAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Please provide a date." });
    }

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(400).json({ message: "Restaurant not found." });
    }

    const bookingDate = new Date(date);

    const bookings = await Booking.find({
      restaurant: restaurant._id,
      date: bookingDate,
      status: "confirmed",
    });

    const availability = restaurant.availableSlots.map((slot) => {
      const bookedSeats = bookings
        .filter((b) => b.time === slot)
        .reduce((sum, b) => sum + b.guests, 0);

      const totalSeats = restaurant.totalSeats || 20;
      const availableSeats = Math.max(0, totalSeats - bookedSeats);

      return {
        time: slot,
        availableSeats,
        isAvailable: availableSeats > 0,
      };
    });

    return res.status(200).json(availability);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};
