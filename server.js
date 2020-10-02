const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

// Connect database
const db =
   'mongodb+srv://ebuka:akara@cluster0.3un02.mongodb.net/shrinkme?retryWrites=true&w=majority';

mongoose
   .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('MongoDB Connected...');
   })
   .catch(() => {
      console.error(err.message);
      process.exit(1);
   });

// Set vew engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
   const shortUrls = await ShortUrl.find();
   res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
   await ShortUrl.create({ full: req.body.fullUrl });

   res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
   const shortUrl = await ShortUrl.findOne({
      short: req.params.shortUrl,
   });
   if (shortUrl == null) return res.sendStatus(404);

   shortUrl.clicks++;
   shortUrl.save();

   res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
