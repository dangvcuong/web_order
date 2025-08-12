require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const tableRoutes = require('./routes/tables');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Check if request is from local network
const isLocalNetwork = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const localNetworks = ['192.168.', '10.', '172.16.', '127.0.0.1', '::1', '::ffff:'];
  
  if (process.env.NODE_ENV === 'development' || 
      localNetworks.some(network => ip.startsWith(network))) {
    return next();
  }
  
  res.status(403).json({ message: 'Truy cập bị từ chối. Vui lòng kết nối mạng nội bộ của quán.' });
};

// Apply local network check to all routes
app.use(isLocalNetwork);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_order')
  .then(() => console.log('Đã kết nối tới MongoDB'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

module.exports = app;
