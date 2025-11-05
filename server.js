require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MONGODB_URI, JWT_SECRET } = process.env;

const app = express();

// ---------------------------
// 1️⃣ CORS middleware
// ---------------------------
const corsOptions = {
  origin: 'https://slot-swapper-frontend-gilt.vercel.app', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Apply CORS to all requests
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// ---------------------------
// 2️⃣ Body parser
// ---------------------------
app.use(express.json());

// ---------------------------
// 3️⃣ MongoDB connection
// ---------------------------
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------------------
// 4️⃣ Session setup
// ---------------------------
const store = MongoStore.create({
  mongoUrl: MONGODB_URI,
  crypto: { secret: JWT_SECRET },
  touchAfter: 24 * 3600,
});

app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// ---------------------------
// 5️⃣ Routes
// ---------------------------
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

const marketplaceRoutes = require('./routes/marketplace');
app.use('/api/marketplace', marketplaceRoutes);

const swapRequestRoutes = require('./routes/swapRequests');
app.use('/api/swaps', swapRequestRoutes);

// ---------------------------
// 6️⃣ Start server
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
