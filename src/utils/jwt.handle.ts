import { sign, verify } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'token.010101';

const generateToken = async (user: []) => {
    const jwt = sign({user}, JWT_SECRET, {
        expiresIn: "2h",
    });
    return jwt;
};

const verifyToken = (jwt:string) => {
    const isOk = verify(jwt, JWT_SECRET);
    return isOk;
};

export { generateToken, verifyToken };