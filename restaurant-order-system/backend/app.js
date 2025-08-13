require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Khởi tạo ứng dụng Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối database thành công!');
    await sequelize.sync({ alter: true }); // Tự động đồng bộ model với database
  } catch (error) {
    console.error('Không thể kết nối database:', error);
    process.exit(1);
  }
};

// Các route
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const tableRoutes = require('./routes/table');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Có lỗi xảy ra!');
});

// Khởi động server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Chỉ lắng nghe trên mạng nội bộ

const startServer = async () => {
  await connectDB();
  app.listen(PORT, HOST, () => {
    console.log(`Server đang chạy tại http://${HOST}:${PORT}`);
    console.log('Chỉ có thể truy cập trong mạng nội bộ của quán');
  });
};

startServer();