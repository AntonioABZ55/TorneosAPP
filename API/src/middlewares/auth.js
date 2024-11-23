const jwt = require('jsonwebtoken');
const JWT_SECRET = "bxdJ0WyDEar4G2GlVx7sX1bUBjEzNtRW";

const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido", err });
    req.user = user;
    next();
  });
};

const verificarRol = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.tipo)) {
    return res.status(403).json({ error: "Acceso no autorizado" });
  }
  next();
};

module.exports = { autenticar, verificarRol };
