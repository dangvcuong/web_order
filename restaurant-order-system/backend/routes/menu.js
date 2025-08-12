const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Thêm món mới vào menu
router.post('/', menuController.createMenuItem);

// Lấy toàn bộ menu
router.get('/', menuController.getAllMenuItems);

// Lấy thông tin chi tiết 1 món
router.get('/:id', menuController.getMenuItemById);

// Cập nhật thông tin món
router.put('/:id', menuController.updateMenuItem);

// Xóa món khỏi menu
router.delete('/:id', menuController.deleteMenuItem);

// Tìm kiếm món theo tên hoặc mô tả
router.get('/search/:query', menuController.searchMenuItems);

// Lấy danh mục món
router.get('/categories', menuController.getCategories);

module.exports = router;
