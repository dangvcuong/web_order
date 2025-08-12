const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Lấy tất cả đơn hàng (có thể lọc theo trạng thái, ngày, bàn...)
router.get('/', orderController.getAllOrders);

// Lấy thông tin chi tiết đơn hàng
router.get('/:id', orderController.getOrderById);

// Cập nhật đơn hàng (thêm/xóa món, cập nhật số lượng, ghi chú...)
router.put('/:id', orderController.updateOrder);

// Hủy đơn hàng
router.delete('/:id', orderController.cancelOrder);

// Thanh toán đơn hàng
router.post('/:id/checkout', orderController.checkoutOrder);

// Lấy lịch sử đơn hàng theo bàn
router.get('/table/:tableId', orderController.getOrdersByTable);

// Lấy đơn hàng hiện tại của bàn
router.get('/table/:tableId/current', orderController.getCurrentOrderByTable);

// Thêm món vào đơn hàng
router.post('/:id/items', orderController.addItemToOrder);

// Cập nhật số lượng món trong đơn hàng
router.put('/:orderId/items/:itemId', orderController.updateOrderItem);

// Xóa món khỏi đơn hàng
router.delete('/:orderId/items/:itemId', orderController.removeItemFromOrder);

module.exports = router;
