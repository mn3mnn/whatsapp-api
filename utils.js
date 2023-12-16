const axios = require('axios')
const { globalApiKey, disabledCallbacks } = require('./config')
const Message = require('./models/Message')

function getJsonResponseTemplate(success, msg, error) {
  const responseJson = {
    data: {
      messages: msg ? [msg] : [],
    },
    error: error,
    success: success,
  };
  return responseJson;
}

function getMsgJsonTemplate(msg) {
  const msgJson = {
    ID: msg._id.toString(),
    attachments: null,
    deliveredDate: null,
    deviceID: null,
    errorCode: null,
    expiryDate: null,
    groupID: null,
    message: msg.content,
    number: msg.to, // Assuming 'mobile_number' is 'mobileNumber'
    prioritize: null,
    resultCode: null,
    retries: null,
    schedule: null,
    sentDate: null,
    simSlot: null,
    status: msg.status,
    type: 'whatsapp',
    userID: null,
  };
  return msgJson;
}



const notifyUserAPI = (message) => {
  const messageID = message._id.toString();
  const messageStatus = message.status;
  // data = {
  //   "msg_id": msg.id,
  //   "mobile_number": msg.mobile_number,
  //   "status": msg.status,
  //   "added_at": msg.added_at,
  //   "pending_at": msg.pending_at,
  //   "sent_at": msg.sent_at
  // }
  console.log(`Notifying user API about messageID: ${messageID} with status: ${messageStatus}`);
}


// Function to wait for a specific item not to be null
const waitForNestedObject = (rootObj, nestedPath, maxWaitTime = 10000, interval = 100) => {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const checkObject = () => {
      const nestedObj = nestedPath.split('.').reduce((obj, key) => obj ? obj[key] : undefined, rootObj)
      if (nestedObj) {
        // Nested object exists, resolve the promise
        resolve()
      } else if (Date.now() - start > maxWaitTime) {
        // Maximum wait time exceeded, reject the promise
        console.log('Timed out waiting for nested object')
        reject(new Error('Timeout waiting for nested object'))
      } else {
        // Nested object not yet created, continue waiting
        setTimeout(checkObject, interval)
      }
    }
    checkObject()
  })
}

const checkIfEventisEnabled = (event) => {
  return new Promise((resolve, reject) => { if (!disabledCallbacks.includes(event)) { resolve() } })
}

module.exports = {
  waitForNestedObject,
  checkIfEventisEnabled,
  notifyUserAPI,
  getJsonResponseTemplate, 
  getMsgJsonTemplate
}
