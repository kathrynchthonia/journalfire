const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// Stories index
router.get('/', (req, res) => {
  Story.find({status: 'public'})
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories
      });
    });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .then(story => {
    res.render('stories/show', {story});
  })
});

// Add story form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});
// edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    res.render('stories/edit', {story});
    });
  });




// Process Add Story
router.post('/', (req, res) => {
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user.id
  }

  // Create new Story
  new Story(newStory)
  .save()
  .then(story => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

// Edit form process
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    let allowComments;

    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
      .then(story => {
        res.redirect('/dashboard')
      });
    });
});

// Delete story
router.delete('/:id', (req, res) => {
  Story.deleteOne({_id: req.params.id})
    .then(() => {
      res.redirect('/dashboard');
    });
});

module.exports = router;