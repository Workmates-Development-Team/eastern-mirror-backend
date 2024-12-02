export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.userType;

    if (!userRole) {
      return res.status(403).json({ message: "No role assigned to the user" });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "User not authorized" });
    }

    next();
  };
};
