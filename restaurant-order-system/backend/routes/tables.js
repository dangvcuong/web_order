const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Tạo bàn mới
router.post('/', tableController.createTable);

// Lấy danh sách tất cả bàn
router.get('/', tableController.getAllTables);

// Lấy thông tin chi tiết 1 bàn
router.get('/:id', tableController.getTableById);

// Cập nhật thông tin bàn
router.put('/:id', tableController.updateTable);

// Xóa bàn
router.delete('/:id', tableController.deleteTable);

// Lấy QR code của bàn
router.get('/:id/qrcode', tableController.getTableQRCode);

// Kiểm tra trạng thái bàn
router.get('/:id/status', tableController.getTableStatus);

module.exports = router;
