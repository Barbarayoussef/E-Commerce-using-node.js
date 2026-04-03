export const authorize = () => {
  return (req, res, next) => {
    try {
      if (req.user.role !== role) {
        return res.status(403).json({ message: "you are not authorized" });
      }
      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid token" });
    }
  };
};
