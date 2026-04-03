export const authorize = (role) => {
  return (req, res, next) => {
    try {
      console.log(req.user.role);

      if (req.user.role !== role) {
        return res.status(403).json({ message: "you are not authorized" });
      }
      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid token" });
    }
  };
};
