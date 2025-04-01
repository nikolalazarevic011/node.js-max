const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization"); // Get the 'Authorization' header

    if (!authHeader) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401; // Set status code to 401 (Unauthorized)
        throw error; // Throw the error if no Authorization header is present
    }

    //! obavezno space u " "!!! posto je bearer jdsloidiwohwq neki token , znaci izm bearer ima razmak
    const token = authHeader.split(" ")[1]; // Extract the token (assuming it is in 'Bearer <token>' format)

    let decodedToken;
    try {
        decodedToken = jwt.verify(
            token,
            "lsldjajwejoiopijwfeoijdwwdweoppoipaaccj3432908902348234892"
        );
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
    if (!decodedToken) {
        error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }
    //stavljamo token koji sad zanmo da je tacan u req, da bi mogli da ga extract na drugim mestima u app
    //393 lekcija Using & Validating the Token, sec 25
    req.userId = decodedToken.userId;
    next();
};
