const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }, '-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ _id: userId, isDeleted: false }, '-password');
  
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };

exports.createUser = async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
  
      // Kiểm tra email và username đã tồn tại hay chưa
      const existingUsername = await User.findOne({ username, isDeleted: false });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username đã tồn tại' });
      }

      const existingEmail = await User.findOne({ email, isDeleted: false });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }
  
      const user = new User({ username, email, password, role });
      await user.save();
  
      res.status(201).json({ message: 'Tạo người dùng thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const currentUserId = req.user.userId; // Lấy ID người dùng đang đăng nhập từ token
    
        // Kiểm tra quyền truy cập
        if (currentUserId !== userId && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
  
      // Kiểm tra email và username đã tồn tại hay chưa (nếu cập nhật)
      if (updates.username || updates.email) {
        const existingUser = await User.findOne({
          $or: [{ username: updates.username }, { email: updates.email }],
          _id: { $ne: userId },
          isDeleted: false // Loại trừ user hiện tại
        });
        if (existingUser) {
          return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
        }
      }
  
      // Cập nhật mật khẩu nếu có (hash mật khẩu mới)
      if (updates.password) {
        // if (!isStrongPassword(updates.password)) {
        //   return res.status(400).json({ message: 'Mật khẩu phải mạnh' });
        // }
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
  
      res.json("Cập nhật thành công");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };


exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user.userId; // Lấy ID người dùng đang đăng nhập

        // Kiểm tra quyền truy cập
        if (currentUserId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
  
        const deletedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
    
        if (!deletedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    
        res.json({ message: 'Người dùng đã được xóa' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    };