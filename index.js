const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const InitMongo = require('./config/mongo-db')
const app = express();
const PORT = 8888;
const layout = path.join('layouts', 'index')
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
const blogs = require('./routes/blogs');
InitMongo();

app.use(cookieParser());
app.use(session({ secret: 'sess_secret', cookie: { maxAge: 600000 }, resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/', userRoutes);
app.use('/blogs', blogs)

app.get('/', (req, res) => {
    res.render('home', {title:"Home Page", layout})
}); 



app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
});