const Message = require('../models/Message');
const whatsappService = require('../services/whatsappService');
const { getJsonResponseTemplate, getMsgJsonTemplate } = require('../utils');

exports.sendMessage = async (req, res) => {
    try {
      const { content, mobile_number } = req.body;

      // Send message asynchronously and respond with message ID
      const message = await whatsappService.addMessage(mobile_number, content);

      const msgJson = getMsgJsonTemplate(message);
      const successJson = getJsonResponseTemplate(true, msgJson, null);

      res.status(200).json(successJson);
      
    } catch (error) {
      console.error(error);

      const errorJson = getJsonResponseTemplate(false, null, 'Internal Server Error');
      res.status(500).json(errorJson);
    }
  };
  

