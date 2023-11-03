const express = require('express');
const CarRouter = express.Router();
const { ParkingSlot} = require('../model/car.model')

CarRouter.post('/park', async (req, res) => {
    try {
        const carNumber = req.body.carNumber;

        // Check if the parking lot is full
        const parkingLotSize = process.env.PARKING_LOT_SIZE; // Correctly access the environment variable
        const occupiedSlots = await ParkingSlot.countDocuments({ carNumber: { $ne: null } }); // Count slots with a non-null carNumber
        if (occupiedSlots >= parkingLotSize) {
            return res.status(400).json({ message: 'Parking lot is full' });
        }

        // Find an available slot
        const availableSlot = await ParkingSlot.findOne({ carNumber: null });

        if (availableSlot) {
            // If an available slot is found, assign the car to it
            availableSlot.carNumber = carNumber;
            await availableSlot.save();
            res.status(201).json({ message: 'Car parked successfully', slotNumber: availableSlot.slotNumber });
        } else {
            // If no available slot is found, return an error
            res.status(400).json({ message: 'No available slots' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to unpark a car
CarRouter.post('/unpark/:slotNumber', async (req, res) => {
    try {
        const slotNumber = req.params.slotNumber;

        // Find the parking slot with the specified slot number
        const parkingSlot = await ParkingSlot.findOne({ slotNumber });

        if (parkingSlot) {
            if (parkingSlot.carNumber) {
                // If the slot is occupied, remove the car and free the slot
                const carNumber = parkingSlot.carNumber;
                parkingSlot.carNumber = null;
                await parkingSlot.save();
                res.status(200).json({ message: 'Car unparked successfully', carNumber, slotNumber });
            } else {
                // If the slot is already empty, return an error
                res.status(400).json({ message: 'Slot is already empty' });
            }
        } else {
            // If the specified slot does not exist, return an error
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get car/slot information
CarRouter.get('/info/:input', async (req, res) => {
    try {
        const input = req.params.input;

        // Check whether the input is a car number or a slot number
        const isSlotNumber = !isNaN(parseInt(input));
        const query = isSlotNumber ? { slotNumber: parseInt(input) } : { carNumber: input };

        // Find the parking slot that matches the query
        const parkingSlot = await ParkingSlot.findOne(query);

        if (parkingSlot) {
            res.status(200).json({ data: parkingSlot });
        } else {
            res.status(404).json({ message: 'Car/slot information not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = {
    CarRouter
}