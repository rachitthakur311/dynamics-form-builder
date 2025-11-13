function authAdmin(req, res, next) {
  try {
    const hdr = req.header("Authorization") || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7).trim() : null;

    // Debug logging (remove in production or use environment variable)
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth Header:', hdr);
      console.log('Token received:', token ? '***' : 'none');
    }

    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ status: false, message: "Unauthorized" });
  } 
};
 

module.exports = authAdmin;
