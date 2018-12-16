require('dotenv').config({ path: 'variables.env' });

const createServer = require('./createServer.js');
const db = require('./db.js');

const server = createServer();

// TODO: create express middlewale to handle cookies (CORS)
// TODO: Use express middleware to populate current user

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, deets => console.log(`Server is now running on port http://localhost:${deets.port}`));
