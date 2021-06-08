const express = require('express')
const { check, validationResult } = require('express-validator')
const config = require('config')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//@route   GET api/auth
//@desc    test
//type     public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(404).json({ msg: 'Not authorized' })
    }
})

//@route  POST api/auth
//@desc    login
//type     public
router.post(
    '/',
    [
        check('email', 'Email is not valid').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            //Check is user exists
            const { email, password } = req.body
            let user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json([{ msg: 'Invalid credentials' }])
            }
            //Compare password

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' })
            }

            //return json web token

            const payload = {
                user: {
                    id: user.id,
                },
            }
            jwt.sign(
                payload,
                config.get('jsonSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err
                    res.json({ token })
                }
            )
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
)

module.exports = router
