import { Booking } from "../models/Booking.js";
import { Restaurant } from "../models/Restaurant.js";

export const createBooking = async (req, res) => {
  try {
    const { restaurantId, date, time, guests, occasion, specialRequests } =
      req.body;

    if (!restaurantId || !date || !time || !guests) {
      return res
        .status(400)
        .json({ message: "Please provide the required reservation details." });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    if (restaurant.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Reservation are not open for this restaurant yet." });
    }

    const requestedGuests = Number(guests);

    if (requestedGuests <= 0) {
      return res.status(400).json({
        message: "Invalid number of guests.",
      });
    }
    const existingBookings = await Booking.find({
      restaurant: restaurantId,
      date: new Date(date),
      time,
      status: "confirmed",
    });

    const bookedSeats = existingBookings.reduce((sum, b) => sum + b.guests, 0);

    const totalSeats = restaurant.totalSeats || 20;

    const availableSeats = totalSeats - bookedSeats;

    if (requestedGuests > availableSeats) {
      return res.status(400).json({
        message: `Unalbe to reserver. Only ${availableSeats} seats are available for this time slot.`,
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      restaurant: restaurantId,
      date: new Date(date),
      time,
      guests: Number(guests),
      occasion,
      specialRequests,
      status: "confirmed",
    });

    const populatedBooking = await booking.populate(
      "restaurant",
      "name location image address"
    );

    return res.status(201).json(populatedBooking);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("restaurant", "name location image address slug")
      .sort({ date: -1, time: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(400).json({
        message: "Booking not found.",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized to cancel this booking",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    const populatedBooking = await booking.populate(
      "restaurant",
      "name location image address"
    );

    return res.status(200).json(populatedBooking);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};
