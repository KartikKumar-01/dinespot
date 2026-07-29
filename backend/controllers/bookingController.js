import { Booking } from "../models/Booking.js";
import { Restaurant } from "../models/Restaurant.js";
import { sendMail } from "../services/mail.js";

export const createBooking = async (req, res) => {
  try {
    const { restaurantId, date, time, guests, occasion, specialRequests } =
      req.body;

    if (!restaurantId || !date || !time || !guests) {
      return res
        .status(400)
        .json({ message: "Please provide the required reservation details." });
    }

    const restaurant = await Restaurant.findById(restaurantId).populate("owner", "email");
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

    console.log("Restaurant owner:", restaurant.owner);
console.log("Owner email:", restaurant.owner?.email);

    await sendMail({
    to: restaurant.owner.email,
    subject: "New Booking",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
  
  <h2 style="color: #2563eb;">🍽️ New Booking Received</h2>

  <p>Hello,</p>

  <p>You have received a new table reservation.</p>

  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td><strong>Customer:</strong></td>
      <td>${req.user.name}</td>
    </tr>
    <tr>
      <td><strong>Date:</strong></td>
      <td>${booking.date}</td>
    </tr>
    <tr>
      <td><strong>Time:</strong></td>
      <td>${booking.time}</td>
    </tr>
    <tr>
      <td><strong>Guests:</strong></td>
      <td>${booking.guests}</td>
    </tr>
  </table>

  <p style="margin-top: 20px;">
    Please log in to your dashboard for more details.
  </p>

  <hr>

  <p style="font-size: 12px; color: #6b7280;">
    DineSpot
  </p>

</div>
    `,
});
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

    const populatedBooking = await booking.populate({
      path: "restaurant",
      select: "name location image address owner",
      populate: {
        path: "owner",
        select: "email"
      }
    })

    await sendMail({
    to: populatedBooking.restaurant.owner.email,
    subject: "Booking Cancelled",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">

  <h2 style="color: #dc2626;">❌ Booking Cancelled</h2>

  <p>Hello,</p>

  <p>A customer has cancelled their table reservation.</p>

  <table style="width:100%;">
    <tr>
      <td><strong>Customer:</strong></td>
      <td>${req.user.name}</td>
    </tr>
    <tr>
      <td><strong>Date:</strong></td>
      <td>${booking.date}</td>
    </tr>
    <tr>
      <td><strong>Time:</strong></td>
      <td>${booking.time}</td>
    </tr>
    <tr>
      <td><strong>Guests:</strong></td>
      <td>${booking.guests}</td>
    </tr>
  </table>

  <p style="margin-top:20px;">
    The reserved table is now available for new bookings.
  </p>

  <hr>

  <p style="font-size:12px;color:#6b7280;">
    DineSpot
  </p>

</div>`
});

    return res.status(200).json(populatedBooking);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};
