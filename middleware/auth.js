const config = require('config')

const jwt = require('jsonwebtoken')

module.exports = auth = async (req, res, next) => {
    //Get token from header
    const token = req.header('x-auth-token')

    //Check if token exists
    if (!token) {
        return res
            .status(401)
            .json({ msg: 'No token found,Authorization not allowed' })
    }
    //Verify token
    try {
        const decoded = await jwt.verify(token, config.get('jsonSecret'))

        req.user = decoded.user

        next()
    } catch (err) {
        console.error(err.message)
        res.status(401).json({ msg: 'Token is not Valid' })
    }
}
