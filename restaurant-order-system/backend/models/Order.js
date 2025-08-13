const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'pending',     // Chờ xác nhận
        'confirmed',   // Đã xác nhận
        'preparing',   // Đang chuẩn bị
        'ready',       // Đã sẵn sàng phục vụ
        'served',      // Đã phục vụ
        'completed',   // Đã hoàn thành
        'cancelled'    // Đã hủy
      ),
      defaultValue: 'pending'
    },
    orderType: {
      type: DataTypes.ENUM('dine_in', 'take_away'),
      defaultValue: 'dine_in'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'partial', 'paid', 'refunded'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Order.associate = function(models) {
    Order.belongsTo(models.Table, {
      foreignKey: 'tableId',
      as: 'table'
    });
    
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'items'
    });
  };

  // Tạo mã đơn hàng tự động
  Order.beforeCreate(async (order) => {
    if (!order.orderCode) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(1000 + Math.random() * 9000);
      order.orderCode = `ORD-${year}${month}${day}-${random}`;
    }
  });

  return Order;
};