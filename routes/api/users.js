const express = require('express')

const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const config = require('config')

const jwt = require('jsonwebtoken')

//@route  POST api/users
//@desc   Register
//type     public

router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is not valid').isEmail(),
        check(
            'password',
            'Please enter a pasword of 6 or more characters'
        ).isLength({ min: 6 }),
        check('phone', 'Phone no. is Required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            //Check is user exists
            const { name, email, phone, password } = req.body
            let user = await User.findOne({ email })

            if (user) {
                return res.status(400).json([{ msg: 'User already exists' }])
            }

            // get the gravatar

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            })

            user = new User({
                name,
                email,
                phone,
                avatar,
                password,
            })

            //encrypt password'
            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            await user.save()

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
