const mongoose = require('mongoose');
const Order = require('../models/Order');
const Table = require('../models/Table');

// Lấy đơn hàng theo bàn
exports.getOrdersByTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { limit = 10, status } = req.query;
    
    const query = { table: tableId };
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .sort({ orderTime: -1 })
      .limit(parseInt(limit));
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy đơn hàng hiện tại của bàn
exports.getCurrentOrderByTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    
    const order = await Order.findOne({
      table: tableId,
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] }
    }).sort({ orderTime: -1 });
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng đang hoạt động' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm món vào đơn hàng
exports.addItemToOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { menuItemId, quantity, note } = req.body;
    const { id: orderId } = req.params;
    
    // Kiểm tra đơn hàng
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    if (order.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Không thể thêm món vào đơn hàng đã xác nhận' });
    }
    
    // Kiểm tra món
    const menuItem = await MenuItem.findById(menuItemId).session(session);
    if (!menuItem) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Không tìm thấy món' });
    }
    
    if (!menuItem.isAvailable) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Món hiện không phục vụ' });
    }
    
    // Thêm món vào đơn hàng
    const existingItemIndex = order.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );
    
    if (existingItemIndex >= 0) {
      // Tăng số lượng nếu món đã có trong đơn
      order.items[existingItemIndex].quantity += parseInt(quantity) || 1;
    } else {
      // Thêm món mới vào đơn
      order.items.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: parseInt(quantity) || 1,
        note: note || ''
      });
    }
    
    // Cập nhật tổng tiền
    order.totalAmount = order.items.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );
    
    await order.save({ session });
    await session.commitTransaction();
    session.endSession();
    
    res.json(order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};
