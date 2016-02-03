var express = require('express');
var router = express.Router();
var Todo = require('../models/todo');

var authenticate = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    next();
  }
}

// INDEX
router.get('/', authenticate, function(req, res, next) {
  var todos = global.currentUser.todos;
  res.render('todos/index', { todos: todos, message: req.flash() });
});

// NEW
router.get('/new', authenticate, function(req, res, next) {
  var todo = {
    title: '',
    completed: false
  };
  res.render('todos/new', { todo: todo, message: req.flash() });
});

// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  var todo = currentUser.todos.id(req.params.id);
  if (!todo) return next(makeError(res, 'Document not found', 404));
  res.render('todos/show', { todo: todo, message: req.flash() } );
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
  var todo = {
    title: req.body.title,
    completed: req.body.completed ? true : false
  };
  currentUser.todos.push(todo);
  currentUser.save()
  .then(function() {
    res.redirect('/todos');
  }, function(err) {
    return next(err);
  });
});

// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var todo = currentUser.todos.id(req.params.id);
  if (!todo) return next(makeError(res, 'Document not found', 404));
  var checked = todo.completed ? 'checked' : '';
  res.render('todos/edit', { todo: todo, checked: checked, message: req.flash() } );
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
  var todo = currentUser.todos.id(req.params.id);
  if (!todo) return next(makeError(res, 'Document not found', 404));
  else {
    todo.title = req.body.title;
    todo.completed = req.body.completed ? true : false;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/todos');
    }, function(err) {
      return next(err);
    });
  }
});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  var todo = currentUser.todos.id(req.params.id);
  if (!todo) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.todos.indexOf(todo);
  currentUser.todos.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/todos');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
