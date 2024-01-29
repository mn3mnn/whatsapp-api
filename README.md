# whatsapp-api

## NodeJs API to send WhatsApp messages from pre-added WhatsApp sessions.

**The API enables the client to send WhatsApp messages with just the API key, message content, and recipient number.**

- When a client wants to send a new message we save it to the DB, add it to the message queue to be sent, and respond with message ID.
- Our WhatsApp service checks the message queue every second and selects an available session to send the message from.
- After trying to send a message we notify the client's API with the message status. 

**Steps:**

- modify `.env`
- modify and run `addNewSession.js` to scan the QR and save the session
- run `app.js` to start the server
- see `sendMessages.js` for examples of how to send messages

**Notes:**
- For this project, I used #nodejs #expressjs #mvc #mongodb
- This project relies on the great "whatsapp-web.js" package.
  
