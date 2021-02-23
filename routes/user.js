const express = require('express');
const path = require('path');
const router = express.Router();
const layout = path.join('layouts', 'index');
const User = require('../Schemas/user');
const Blog = require('../Schemas/blog');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const auth = require('../auth/auth');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');

router.get('/alluserblogs', async (req, res) => {

    const blogs = await Blog.find().populate('userId');
    // console.log(blogs)

    res.render('alluserblogs', {title:"Read Blogs", layout, blogs});


});


router.get('/signup', (req, res) => {
    data = {
        title: 'Sign up',
        layout,
        name: "",
        email: "",
        phone: "",
        password: "",
    }
    res.render('signup', data);
});

router.post('/signup',

    [
        check('name', "Please enter the name").not().isEmpty(),
        check("email", "Please enter the email").isEmail(),
        check("phone", "Please enter a valid contact number").not().isEmpty(),
        check('password', " Please choose a password").isLength({ min: 6 })
    ],

    async (req, res) => {
        const err = validationResult(req);
        console.log(err);
        const error = {err}

        try {
            let user = await User.findOne({email: req.body.email});
            if (user) {
                error.email = 'User already exists! Please enter a different email or login'
                return res.render('signup', {title:"Sign up", error, layout});
            }
            user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
            })
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
            
            await user.save();
            // const data = {
            //     error,
            //     title: 'Sign up',
            //     layout,
            //     ...user
            // }
            res.redirect('/login');
        } catch(e) {
            console.log(e);
            throw e;

        }
    });


router.get('/login', (req, res)=> {
    // console.log(req.cookies);
    
    if(req.session.user) {
        return res.redirect('/profile');
    }
    res.render('login', {
        title: "Login",
        layout,
        email: "",
        password: ""
    })
});

router.post('/login', 
[
    check('email', "Please enter the email").isEmail(),
    check('password', 'Please enter the password').not().isEmpty()
],
async (req, res) => {
    const err = validationResult(req);
    const error = {err};
    if (!err.isEmpty()){
        error.message='Please enter the details!!!';
        return res.render('login', {title:"Login",layout,error});
    }
    const user = await User.findOne({email:req.body.email});

    if (!user) {
        error.message = 'User does not exists. Please signup first...';
        error.email = "Email id not registered!"
        return res.render('login', {layout,title:"Login", error})
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        error.message = "Invalid Credentials!"
        error.password = "Incorrect password!"
        return res.render('login', {title:"Login", layout, error})
    }
    req.session.user = user

    res.redirect('/profile');

});

router.get('/profile', auth, (req, res)=> {
    // console.log(req.session.user)
    res.render('profile', {title: "Profile", user: req.session.user, layout});
});

router.get('/logout', (req, res)=> {
    req.session.user = "";
    res.redirect('/login');
});

module.exports = router;