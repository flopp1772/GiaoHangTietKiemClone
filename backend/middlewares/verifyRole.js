export const verifyRole = (allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
        return res.status(403).json({ message: "Permission denied" });
    }
    next();
};
