import jwt from 'jsonwebtoken';


export function generateTempJWT(user) {
    return jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }