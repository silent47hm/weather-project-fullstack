import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  // Try to get token from cookie first, then from Bearer token
  const token =
    req.cookies.token ||
    (req.headers.authorization?.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
