const express = require('express');
const cors = require('cors');
const app = express();
const todosArr = [
    {
        id:1,
        task:"create all API's for project 01",
        tags: ["NodeJS", 'backend'],
        status:"todo"
    },
    {
        id:2,
        task:"create API for list of all todos",
        tags: ["NodeJS"],
        status:"doing"
    },
    {
        id:3,
        task:"plan project 01",
        tags: ['JavaScript'],
        status:"done"
    }
]

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/todos', (req, res) => {
  res.json(todosArr);
});

app.get('/todos/test', (req, res) => {
    res.send('test route');
});

app.get('/todos/:id', (req, res) => {
    
    // res.send(req.params.status);
    const todoId = parseInt(req.params.id);
    const todo = todosArr.find((t) => t.id == todoId);
    if (todo) {
        res.json(todo);
    } else {
        res.status(404).send('Todo not found');
    }
});

app.post('/todos', (req, res) => {
    const todo = req.body;
    if (!todo.task || !todo.tags || !todo.status) {
        return res.status(400).json({ error: 'Missing required fields' });
    };
    const newTodo = {
        id: todosArr.length + 1,
        task: todo.task,
        tags: todo.tags,
        status: todo.status
    };
    todosArr.push(newTodo);
    // console.log(todo);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { task, tags, status } = req.body;
    const todoIndex = todosArr.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    if(task) todosArr[todoIndex].task = task;
    if(tags) todosArr[todoIndex].tags = tags;
    if(status) todosArr[todoIndex].status = status;
    res.json(todosArr[todoIndex]);
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todosArr.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    };
    todosArr.splice(todoIndex, 1);
    res.status(200).json({message:"todo deleted successfully"});
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...k`);
});
