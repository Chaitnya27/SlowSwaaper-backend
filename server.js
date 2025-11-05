require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: 'slot-swapper-frontend-git-main-chaitnya-khedekars-projects.vercel.app',
  credentials: true,
}));
app.use(express.json());

// MongoDB connection
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

const marketplaceRoutes = require('./routes/marketplace');
app.use('/api/marketplace', marketplaceRoutes);

const swapRequestRoutes = require('./routes/swapRequests');
app.use('/api/swaps', swapRequestRoutes);



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server started on port ${PORT}`);
});
