const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Khởi tạo Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    dialectOptions: config.dialectOptions || {},
  }
);

// Import các model
const db = {
  sequelize,
  Sequelize,
  User: require('./User')(sequelize, Sequelize),
  MenuItem: require('./MenuItem')(sequelize, Sequelize),
  Table: require('./Table')(sequelize, Sequelize),
  Order: require('./Order')(sequelize, Sequelize),
  OrderItem: require('./OrderItem')(sequelize, Sequelize)
};

// Thiết lập quan hệ giữa các model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
