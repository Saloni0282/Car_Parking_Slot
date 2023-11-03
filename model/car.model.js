// Create a Mongoose model for parking slots
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingSlotSchema = new Schema({
    slotNumber: { type: Number, unique: true },
    carNumber: String,
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

// Create a Mongoose model for IP rate limiting
const rateLimitSchema = new Schema({
    ipAddress: { type: String, unique: true },
    requests: Number,
});

const RateLimit = mongoose.model('RateLimit', rateLimitSchema);

module.exports = {
    ParkingSlot,
    RateLimit
};
