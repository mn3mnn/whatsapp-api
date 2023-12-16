// middleware.js

const validateRequest = (req, res, next) => {
    
    // If validation fails, you can send an error response
    if (!req.body || !req.body.content || !req.body.mobile_number) {
      return res.status(400).json({ error: 'Invalid Parameters' });
    }
  
    // If validation passes, move to the next middleware
    next();
  };
  
  const checkAPIKey = (req, res, next) => {
    const apiKey = req.body.key;
  
    // Check if API key is valid
    if (apiKey && apiKey === process.env.API_KEY) {
      // API key is valid, move to the next middleware
      next();
    } else {
      // API key is invalid, send an error response
      res.status(401).json({ error: 'Unauthorized, check your "key" ' });
    }
  };
  
  module.exports = {
    validateRequest,
    checkAPIKey,
  };
  