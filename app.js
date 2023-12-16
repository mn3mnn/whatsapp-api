const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const { connectToDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', apiRoutes);


const main = async () => {
  try {
    // Connect to the database
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main();
