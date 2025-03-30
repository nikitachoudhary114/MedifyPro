// import jwt from "jsonwebtoken";

// export const auth = (req, res, next) => {
    

//     try {
//         const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
//         if (!token) {
//             return res.status(401).json({ message: "No token provided" });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
//         req.user = decoded;
//         console.log(token)
//         console.log(req.user)
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };

import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    // console.log("Auth middleware executed");
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Token:", req.headers.authorization);
    if (!token) {
        return res.status(401).json({ message: "No token provided" }); // 401 Unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user data to req.user
        // console.log("Decoded User:", req.user);
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" }); // 401 Unauthorized
    }
};



