const express = require("express");
const authRoutes = require("./auth/index.js");
const cmsRoutes = require("./cms/index.js");
const frontRoutes = require("./front/index.js");
const profileRoutes = require("./profile/profile.routes.js");
const { auth, adminStaff, customerOnly } = require("../lib/index.js");
const { Profile } = require("../controllers/index.js");

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/cms', auth, adminStaff, cmsRoutes);

router.use('/profile', auth, profileRoutes);

router.use('/checkout', auth, customerOnly, Profile.checkout)

router.get('/image/:filename', (req, res, next)=>{
    res.sendFile(`uploads/${req.params.filename}`, {
        root: "../api"
    })
})

router.use(frontRoutes)


router.use((req, res, next) =>{
    next({
        message: 'resource not found',
        status: 404
    })
})


module.exports = router