const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (!token) return res.status(403).send("Access denied. Unauthorized to access it. Please provide the authorization");

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
            console.log(token);
        } else {
            return res.status(400).send("Please provide token like Bearer [token]");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("=========================")
        console.log(error)
        if(error instanceof jwt.TokenExpiredError){
            return res.status(400).send({message:"The provide token is expired. Generate new token.",error:error.message});
        }else if(error instanceof jwt.JsonWebTokenError){
            return res.status(400).send({message:"The provide token is invalid. Generate new token or check provided token once.",error:error.message});
        }else if(error instanceof jwt.NotBeforeError){
            return res.status(400).send({message:"The provided token is invalid. Provided token current time is before the nbf claim.",error:error.message});
        }else if(error instanceof SyntaxError){
            return res.status(400).send({message:"The provided token is invalid. Modified the token.",error:error.message});
        }
       
        res.status(400).send({message:"Invalid token",error:error.message});
    }
};