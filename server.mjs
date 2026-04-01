import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let students = [];
let nextId = 1;

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === 'password123') {
    res.json({ access_token: 'mock-jwt-token-123' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/students', (req, res) => {
  res.json(students);
});

app.post('/api/students', (req, res) => {
  const student = { id: nextId++, ...req.body };
  students.push(student);
  res.json(student);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (student) res.json(student);
  else res.status(404).json({ message: 'Student not found' });
});

app.put('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    students[index] = { id: parseInt(req.params.id), ...req.body };
    res.json(students[index]);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

app.delete('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    students.splice(index, 1);
    res.json({ message: 'Student deleted' });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`);
});
