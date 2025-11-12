function authAdmin(req, res, next) {
  try {
    const hdr = req.header("Authorization") || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;

    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    next();
  } catch {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  } 
};
 

module.exports = authAdmin;
