const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
  const Table = sequelize.define('Table', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tableNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    qrCode: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: () => `table-${uuidv4()}`
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'reserved', 'cleaning'),
      defaultValue: 'available'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    currentOrderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Table.associate = function(models) {
    Table.belongsTo(models.Order, {
      foreignKey: 'currentOrderId',
      as: 'currentOrder'
    });
    
    Table.hasMany(models.Order, {
      foreignKey: 'tableId',
      as: 'orders'
    });
  };

  return Table;
};