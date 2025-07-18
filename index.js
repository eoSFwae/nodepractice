const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');


morgan.token('body',(req,res)=>{return JSON.stringify(req.body)})

app.use(cors());
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons =  [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423422"
    }
]

const generateId = ()=>{
    return Math.floor(Math.random() * 95955);
}

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/info', (request, response) => {
    const phonebookCount = persons.length;
    const date = new Date();
    response.set('content-type', 'text/html');
    response.send(
        `<p>Phonebook has info for ${phonebookCount} people</p>
               <p>${date}</p>
    `);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = generateId()
    const body = {...request.body, id}

    if(!body.name || !body.number){
        return response.status(400).json({ error: 'missing required fields' })
    }

    if(persons.find(person => person.name === body.name)){
        return response.status(400).json({ error: 'name must be unique' })
    }

    persons = persons.concat(body)
    response.json(body)
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Listening on port ${PORT}!`)