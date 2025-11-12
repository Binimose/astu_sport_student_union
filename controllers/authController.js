// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // ← THIS WAS MISSING
const pool = require('../config/db');
const queries = require('../sql/queries');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'astu-id-cards' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

// controllers/authController.js → register function
const register = async (req, res) => {
  try {
    const { studentId, fullName, email, password, department } = req.body;

    // ID CARDS (existing)
    const idFront = req.files?.idFront?.[0];
    const idBack = req.files?.idBack?.[0];
    if (!idFront || !idBack) return res.status(400).json({ message: 'ID front & back required' });

    // PROFILE PHOTO (NEW)
    const profilePhoto = req.files?.profilePhoto?.[0];
    let profilePhotoUrl = 'https://res.cloudinary.com/dnrrnrxaq/image/upload/v1762615019/default-avatar.jpg'; // default

    if (profilePhoto) {
      profilePhotoUrl = await uploadToCloudinary(profilePhoto.buffer);
    }

    // Upload ID cards
    const [frontUrl, backUrl] = await Promise.all([
      uploadToCloudinary(idFront.buffer),
      uploadToCloudinary(idBack.buffer)
    ]);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // INSERT INTO DB (include profile_photo)
    const result = await pool.query(queries.INSERT_USER, [
      studentId,
      fullName,
      email,
      passwordHash,
      department,
      frontUrl,
      backUrl,
      profilePhotoUrl  // ← NEW FIELD
    ]);

    res.status(201).json({ message: 'Registration successful. Awaiting approval.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/authController.js → login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await pool.query(queries.FIND_BY_EMAIL, [email]);
    const user = result.rows[0];

    if (!user || user.status !== 'approved') {
      return res.status(401).json({ message: 'Invalid credentials or not approved' });
    }

    // TEMPORARY: SKIP PASSWORD CHECK
    console.log('BYPASSING PASSWORD CHECK FOR TESTING');
    // const match = await bcrypt.compare(password, user.password_hash);
    // if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful (BYPASS MODE)',
      user: { id: user.id, email: user.email, role: user.role, status: user.status }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };