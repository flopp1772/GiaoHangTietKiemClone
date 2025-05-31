import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // hoặc từ header nếu bạn dùng

  if (!token) return res.status(401).json({ message: "Not authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid!" });
    }

    req.userId = payload.userId;
    req.role = payload.role;   // <-- Gán role từ payload
    console.log("✅ Token verified - role:", req.role);

    next();
  });
};
