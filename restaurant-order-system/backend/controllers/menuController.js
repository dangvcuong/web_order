const MenuItem = require('../models/MenuItem');

// Tạo món mới
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, isAvailable = true } = req.body;
    
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      imageUrl,
      isAvailable
    });
    
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy tất cả món trong menu
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, isAvailable } = req.query;
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }
    
    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin chi tiết món
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Không tìm thấy món' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin món
exports.updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, isAvailable } = req.body;
    
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Không tìm thấy món' });
    }
    
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;
    menuItem.imageUrl = imageUrl || menuItem.imageUrl;
    if (isAvailable !== undefined) {
      menuItem.isAvailable = isAvailable;
    }
    
    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa món khỏi menu
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Không tìm thấy món' });
    }
    res.json({ message: 'Đã xóa món thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tìm kiếm món
exports.searchMenuItems = async (req, res) => {
  try {
    const query = req.params.query;
    const searchResults = await MenuItem.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách các danh mục món
exports.getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
