import jwt from "jsonwebtoken";

const jwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRETE, { expiresIn: '1d' });
};

export default jwtToken;
