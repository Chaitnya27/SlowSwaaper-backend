require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MONGODB_URI, JWT_SECRET } = process.env;
const app = express();

// Middleware
app.use(cors({
  origin: 'https://slot-swapper-frontend-gilt.vercel.app',
  credentials: true,
}));
app.use(express.json());

// MongoDB connection
  mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error(" MongoDB connection error:", err));

  const store = MongoStore.create({
     mongoUrl:MONGODB_URI,
     crypto:{
      secret:JWT_SECRET
     },
     touchAfter:24*3600
  })
  
  app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
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
