const Client = require('whatsapp-web.js');
const { sessions, validateSession, restoreSessions } = require('../sessions');

const Message = require('../models/Message');
const { saveNewMessage } = require('../db');

const { notifyUserAPI } = require('../utils');

let curr_client_index = 0;  // round-robin to get the next available client

const messageQueue = [];

// Initialize {sessions} with the WhatsApp clients from the sessions directory
restoreSessions();


exports.addMessage = async (phoneNumber, content) => {
  // Save message to db
  const message = await saveNewMessage(phoneNumber, content);

  // Add message to the queue
  messageQueue.push(message);

  return message;
};


const getAvailableClient = async () => {
  console.log(`Trying to get client, sessions size: ${sessions.size}`);
  
  let availableClient = null;
  let i = 0;

  while (i < sessions.size) {
    const sessionId = Array.from(sessions.keys())[curr_client_index];
    const { success, message } = await validateSession(sessionId);
    
    console.log(`SessionID: ${sessionId}, connected: ${success}, message: ${message}`);

    if (success) {
      availableClient = sessions.get(sessionId);
      console.log(`Current client index ${curr_client_index}, connected: ${success}, message: ${message}`);
      break;
    }

    i++;
    curr_client_index = (curr_client_index + 1) % sessions.size;
  }

  if (!availableClient) {
    throw new Error('No available clients to send a message');
  }

  curr_client_index = (curr_client_index + 1) % sessions.size; // Move to the next index for round-robin
  return availableClient;
};


// Worker to process the message queue
const processMessageQueue = async () => {
  while (messageQueue.length > 0) {
    const message = messageQueue.shift();
    try{
      processMessage(message);
    }
    catch(error){
      console.error(error);
    }
  }
};

const processMessage = async (message) => {
  const { _id, to: phoneNumber, content } = message;
  const messageID = _id.toString();

  console.log(`Processing message: '${content}' to '${phoneNumber}'`);

  try {
    // Get an available client
    const client = await getAvailableClient();

    // Check if the phone number we are sending to is registered on WhatsApp
    const isRegistered = await client.isRegisteredUser(phoneNumber);
    if (!isRegistered) {
      throw new Error('Phone number is not registered on WhatsApp');
    }

    // Send the message and update the message status
    try {
      await client.sendMessage(`${phoneNumber}@c.us`, content);
      console.log(`sent message: '${content}' to '${phoneNumber}'`);
      message.status = 'sent';
      message.sentFrom = client.info.me.user
      message.sentAt = Date.now();
    } catch (error) {
      console.error(`error sending message: '${content}' to '${phoneNumber}'`, error);
      message.status = 'failed';
    }
  } catch (error) {  // update the message status in case of an error
    console.error(error);
    message.status = 'failed';
  }

  // Save the message status
  await message.save();

  // Notify the user API about the message status
  notifyUserAPI(message);
};

// Periodically process the message queue
setInterval(processMessageQueue, 100); // each 100ms

