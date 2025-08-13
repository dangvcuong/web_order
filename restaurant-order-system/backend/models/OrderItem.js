const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'pending',     // Chờ xác nhận
        'preparing',   // Đang chuẩn bị
        'ready',       // Đã sẵn sàng
        'served',      // Đã phục vụ
        'cancelled'    // Đã hủy
      ),
      defaultValue: 'pending'
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  });

  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
      onDelete: 'CASCADE'
    });
    
    OrderItem.belongsTo(models.MenuItem, {
      foreignKey: 'menuItemId',
      as: 'menuItem'
    });
    
    OrderItem.belongsTo(models.User, {
      foreignKey: 'preparedById',
      as: 'preparedBy'
    });
  };

  // Tự động tính tổng tiền trước khi lưu
  OrderItem.beforeSave(async (orderItem) => {
    if (orderItem.quantity && orderItem.unitPrice) {
      orderItem.totalPrice = orderItem.quantity * orderItem.unitPrice;
      
      // Áp dụng giảm giá nếu có
      if (orderItem.discount) {
        orderItem.totalPrice -= orderItem.discount;
        // Đảm bảo tổng tiền không âm
        if (orderItem.totalPrice < 0) orderItem.totalPrice = 0;
      }
    }
  });

  return OrderItem;
};