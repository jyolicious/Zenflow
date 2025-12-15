// middleware/auth.js
import jwt from "jsonwebtoken";

function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // require admin role (adjust field name to your user model)
    if (!payload || payload.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export { requireAdmin };
export default requireAdmin;
