const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { tableId, items, note } = req.body;
    
    // Kiểm tra bàn
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }
    
    if (table.status === 'occupied') {
      return res.status(400).json({ message: 'Bàn đang có khách' });
    }
    
    // Kiểm tra các món
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Không tìm thấy món có ID: ${item.menuItemId}` });
      }
      
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Món ${menuItem.name} hiện không phục vụ` });
      }
      
      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        note: item.note || ''
      });
      
      totalAmount += menuItem.price * item.quantity;
    }
    
    // Tạo đơn hàng
    const order = new Order({
      table: tableId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      note: note || '',
      orderTime: new Date()
    });
    
    await order.save();
    
    // Cập nhật bàn
    table.status = 'occupied';
    table.currentOrder = order._id;
    await table.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, tableId } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (tableId) query.table = tableId;
    
    if (startDate || endDate) {
      query.orderTime = {};
      if (startDate) query.orderTime.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.orderTime.$lte = end;
      }
    }
    
    const orders = await Order.find(query)
      .populate('table', 'tableNumber')
      .sort({ orderTime: -1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
