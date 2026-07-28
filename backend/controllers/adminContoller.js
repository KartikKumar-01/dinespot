import { Booking } from "../models/Booking.js";
import { Restaurant } from "../models/Restaurant.js";
import { User } from "../models/User.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({})
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });
    return res.status(200).json(restaurants);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const approveRestaurant = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Please provide valid approval status." });
    }

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant profile not found." });
    }

    restaurant.status = status;
    restaurant.save();
    return res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUser = await User.countDocuments({ role: "user" });
    const totalOwner = await User.countDocuments({ role: "owner" });
    const totalBookings = await Booking.countDocuments({});
    const totalRestaurants = await Restaurant.countDocuments({});

    const latestBookings = await Booking.find({})
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      users: {
        totalUser,
        totalOwner,
        total: totalUser + totalOwner,
      },
      restaurants: {
        total: totalRestaurants,
      },
      bookings: {
        total: totalBookings,
      },
      latestBookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
};
