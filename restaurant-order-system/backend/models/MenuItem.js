const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const MenuItem = sequelize.define('MenuItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM(
        'appetizer', 
        'main_course', 
        'beverage', 
        'dessert', 
        'side_dish',
        'alcoholic_drink',
        'non_alcoholic_drink'
      ),
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    preparationTime: {
      type: DataTypes.INTEGER, // Thời gian chuẩn bị (phút)
      defaultValue: 15
    },
    isSpecial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  MenuItem.associate = function(models) {
    MenuItem.hasMany(models.OrderItem, {
      foreignKey: 'menuItemId',
      as: 'orderItems'
    });
  };

  return MenuItem;
};