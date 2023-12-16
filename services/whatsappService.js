const Client = require('whatsapp-web.js');
const { sessions, validateSession, restoreSessions } = require('../sessions');

const Message = require('../models/Message');
const { saveNewMessage } = require('../db');

const { notifyUserAPI } = require('../utils');

let curr_client_index = 0;  // round robin to get the next available client

const messageQueue = []; // Simple array-based message queue

// Initialize the WhatsApp clients from the saved sessions
restoreSessions();

exports.addMessage = async (phoneNumber, content) => {
  // Save message with status and get ID
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


























// const { Client } = require('whatsapp-web.js');
// const { sessions, validateSession, restoreSessions } = require('../sessions');

// const { Message } = require('../models/Message');
// const { saveNewMessage } = require('../db');

// const { Queue, Worker } = require('bull');
// const messageQueue = new Queue('messageQueue');

// const { notifyUserAPI } = require('../utils');

// let curr_client_index = 0;  // round robin to get the next available client


// // Initialize the whatsapp clients from the saved sessions
// restoreSessions();


// exports.addMessage = async (phoneNumber, content) => {  

//   // Save message with status and get ID
//   const message = await saveNewMessage(phoneNumber, content);

//   // Add message to the queue
//   await messageQueue.add({message});

//   return message;
// };

// function getAvailableClient() {
//   // loop through the sessions and get the first available client from the last used client
//   let client = null;
//   let i = 0;
//   while (client == null && i < sessions.length) {

//     const { connected, message } = validateSession(Object.keys(sessions)[curr_client_index]);
//     console.log(`client ${sessions.keys()[curr_client_index]} , connected: ${connected}, message: ${message}`);

//     if (connected) {
//       client = sessions.get(Object.keys(sessions)[curr_client_index]);
//     }
//     console.log(`client ${curr_client_index} state:  ${sessions.get(Object.keys(sessions)[curr_client_index]).getState()}`);
//     i++;
//     curr_client_index = (curr_client_index + 1) % sessions.length;
//   }
  
//   if (client == null) {
//     throw new Error('No available clients to send message');
//   }

//   return client;
// }


// // Worker to process the message queue
// const messageQueueWorker = new Worker('messageQueue', async job => {
//   const { message } = job.data;
  
//   const { _id, to: phoneNumber, content } = message;
//   const messageID = _id.toString();
  
//   console.log(`Processing message: '${content}' to '${phoneNumber}'`);

//   let messageSent = false;

//   try {
//     // Get an available client
//     const client = getAvailableClient();

//     // Check if the phone number we sending to is registered on WhatsApp
//     const isRegistered = await client.isRegisteredUser(phoneNumber);
//     if (!isRegistered) {
//       throw new Error('Phone number is not registered on WhatsApp');
//     }

//     // Send the message and update the message status
//     try {
//       await client.sendMessage(`${phoneNumber}@c.us`, content);
//       console.log(`sent message: '${content}' to '${phoneNumber}'`);
//       message.status = 'sent';
//     } 
//     catch (error) {
//       console.error(`error sending message: '${content}' to '${phoneNumber}'`, error);
//       message.status = 'failed';
//     }
//   } 
//   catch (error) {  // update the message status in case of error
//     console.error(error);
//     message.status = 'failed';
//   }
//   // Save the message status
//   await message.save();

//   // Notify the user API about the message status
//   notifyUserAPI(message);
  
// });

