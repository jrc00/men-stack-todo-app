var mongoose = require('mongoose');
var Todo = require('./models/todo');

mongoose.connect('mongodb://localhost/todos');

// our app will not exit until we have disconnected from the db.
function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.log('ERROR:', err);
  quit();
  return err;
}

// promises & checking the databases
console.log('removing old todos...');
Todo.remove({})
.then(function() {
  console.log('old todos removed');
  console.log('creating some new todos...');
  var groceries = new Todo({ title: 'groceries', completed: false });
  var dog = new Todo({ title: 'feed the dog', completed: true });
  return Todo.create([groceries, dog]);
})
.then(function(savedTodos) {
  console.log('Todo ' + savedTodos + ' has been saved');
return Todo.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos...');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  quit();
});
