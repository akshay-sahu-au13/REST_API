const express = require('express');
const path = require('path');
const router = express.Router();
const layout = path.join('layouts', 'index');
const User = require('../Schemas/user');
const Blog = require('../Schemas/blog');
const auth = require('../auth/auth');


router.get('/', auth, (req, res) => {
    res.render('blog', { layout, title: "User Blogs" });
});

router.post('/', auth, async (req, res) => {
    console.log(req.session.user)
    const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        userId: req.session.user._id
    });

    await blog.save();
    blog.message = "Blog created successfully..."
    const data = {
        title: "blog created",
        layout,
        blog
    }

    res.render('blog', data)
});


router.get('/allblogs', auth, async (req, res) => {
    const user = await User.findById({ "_id": req.session.user._id });
    const blogs = await Blog.find({ "userId": req.session.user._id });
    const author = user.name
    const Blogs = blogs.map(item => {
        return { title: item.title, Content: item.body }
    })
    const data = {
        title: "All Blogs",
        Blogs,
        author
    }
    res.render('allblogs', data)
    // res.status(200).json({AUTHOR: author, BLOGS: Blogs});

});



module.exports = router;