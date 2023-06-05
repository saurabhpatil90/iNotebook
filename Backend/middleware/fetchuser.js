const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Saurabhisagoodb$oy';

const fetchuser = (req, res, next)=> {
    // get the user from the jwt and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authenticate using valid token" })
    }
    try {
        const data =  jwt.verify(token, JWT_SECRET);
        // console.log(data)
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "please authenticate using valid token 2" })
    }

}

module.exports = fetchuser;