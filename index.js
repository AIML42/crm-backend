// index.js

// importing files and modules
require("dotenv").config();
require("./db/connection");
const express = require("express");
const errorHandler = require("./utils/errorResponse");
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const ticketRoutes = require('./routes/ticketRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const cors = require('cors');


// 
const app = express();


// middlewares
app.use(express.json());
app.use(cors({
    origin: '*',
}))


// routes
app.use("/api/auth", authRoutes)
app.use("/api/team", teamRoutes)
app.use('/api/tickets', ticketRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/metrics', metricsRoutes);


// error handler 
app.use(errorHandler);

// 
const port = process.env.PORT || 4000;


app.listen(port, () => {
    console.log(`Server running at ${port}`);
})