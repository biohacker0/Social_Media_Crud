const express = require('express')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const config = require('config')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const request = require('request')
const router = express.Router()

//@route get api/profile/me
//@desc Get current user profile
//@access Public

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ msg: 'No profile found' })
        }
        res.json(profile)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Sever Error')
    }
})
//@route POST api/profile
//@desc Create or Update user profile
//@access Public

router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills is Required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company,
            website,
            bio,
            location,
            status,
            skills,
            githubusername,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body

        const profileFields = {}
        profileFields.user = req.user.id
        if (website) profileFields.website = website
        if (company) profileFields.company = company
        if (bio) profileFields.bio = bio
        if (location) profileFields.location = location
        if (website) profileFields.website = website
        if (status) profileFields.status = status
        if (skills) {
            profileFields.skills = skills
                .split(',')
                .map((skill) => skill.trim())
        }

        if (githubusername) profileFields.githubusername = githubusername
        //Build social object

        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube
        if (twitter) profileFields.social.twitter = twitter
        if (instagram) profileFields.social.instagram = instagram
        if (facebook) profileFields.social.facebook = facebook
        if (linkedin) profileFields.social.linkedin = linkedin

        try {
            let profile = await Profile.findOne({ user: req.user.id })
            //For Update User
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )
                return res.json(profile)
            }
            //Create
            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server error')
        }
    }
)
//@route get api/profile
//@desc Get all profiles
//@access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar',
            'phone',
        ])

        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})
//@route get api/profile/user/:id
//@desc Get profile using user id
//@access Public

router.get('/user/:id', async (req, res) => {
    try {
        let profile = await Profile.findOne({
            user: req.params.id,
        }).populate('user', ['name', 'avatar', 'phone'])

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile is not found' })
        }
        res.status(500).send('Server error')
    }
})
//@route   DELETE api/profile/
//@desc   DELETE profile by id
//type     private

router.delete('/', auth, async (req, res) => {
    try {
        //todo remove user posts

        await Profile.findOneAndRemove({ user: req.user.id })
        await User.findOneAndRemove({ _id: req.user.id })

        res.json('User deleted')
    } catch (err) {
        console.error(err.msg)
        res.status(500).send('Server error')
    }
})

//@route   GET api/profile/education
//@desc   Add education
//type     private

router.put(
    '/education',
    [
        auth,
        check('school', 'School is required').not().isEmpty(),
        check('fieldofstudy', 'Field of Study is required ').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
    ],
    async (req, res) => {
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body

        const newEducation = {}

        if (school) newEducation.school = school
        if (degree) newEducation.degree = degree
        if (fieldofstudy) newEducation.fieldofstudy = fieldofstudy
        if (from) newEducation.from = from
        if (to) newEducation.to = to
        if (current) newEducation.current = current
        if (description) newEducation.description = description
        try {
            const profile = await Profile.findOne({ user: req.user.id })

            if (!profile) {
                return res.status(404).json({ msg: 'No profile found' })
            }

            profile.education.unshift(newEducation)

            await profile.save()
            res.json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    }
)
//@route DELETE api/profile/education/:edu_id
//@desc Delete education
//@access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        })
        if (!profile) {
            return res.status(400).json({ msg: 'No profile found' })
        }
        const removeIndex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.edu_id)

        profile.education.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'No profile found' })
        }
        res.status(500).send('Server error')
    }
})
//@route GET api/profile/github/:username
//@desc Get github repo
//@access Public
router.get('/github/:username', (req, res) => {
    try {
        const option = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
            )}&client_secret${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'nodejs' },
        }
        request(option, (error, response, body) => {
            if (error) console.error(error.message)
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'NO Repos Found' })
            }
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router
