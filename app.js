const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');

// express app
const app = express();

const PORT = process.env.PORT || 3000;
// connect to mongodb
const dbURI =
  'mongodb+srv://olimoli:test1234@nodetuts.u5q1b.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    // listen for requests
    app.listen(3000, () => console.log(`App listening on port ${PORT}`));
    console.log('Connected to the DB');
  });

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));

// mongoose and mongo sandbox route
app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'Blog Three',
    snippet: 'AboutBlog Three',
    body: 'More AboutBlog Three'
  });
  blog
    .save()
    .then(result => res.send(result))
    .catch(err => console.log(err));
});
app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
      console.log(result.join());
    })
    .catch(err => console.log(err));
});
app.get('/single-blog', (req, res) => {
  Blog.findById('5ffaad630c9599fa7f64b19e')
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.use((req, res, next) => {
  console.log('in the next middleware');
  next();
});

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  const blogs = [
    {
      title: 'Yoshi finds eggs',
      snippet: 'Lorem ipsum dolor sit amet consectetur'
    },
    {
      title: 'Mario finds stars',
      snippet: 'Lorem ipsum dolor sit amet consectetur'
    },
    {
      title: 'How to defeat bowser',
      snippet: 'Lorem ipsum dolor sit amet consectetur'
    }
  ];
  res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
