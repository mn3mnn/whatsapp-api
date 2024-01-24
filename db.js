const mongoose = require('mongoose');
const { mongodbURI } = require('./config');
const Message = require('./models/Message');

const connectToDatabase = async () => {
  try {
    console.log('Connecting to MongoDB');
    await mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};


async function saveNewMessage(phoneNumber, content) {
    // Save message with 'pending' status and get ID
    console.log('Saving new message to DB');
    const status = 'pending';
    to = phoneNumber;
    const newMessage = new Message({ to, content, status, addedAt: Date.now() });
    await newMessage.save();
    console.log(`Message saved to DB with ID: ${newMessage._id}`);
    return newMessage;
}


module.exports = { connectToDatabase, saveNewMessage };
