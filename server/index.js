const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { mongoDb } = require('./models/DB');
const { UserModel } = require('./models/UserModel');
const { TodoModel } = require('./models/TodoModel');
const { AuthUser } = require('./middleWares/AuthUser');

const app = express();
app.use(cors());
app.use(express.json());

mongoDb();

// Public
app.get("/", (req, res) => res.send("🚀 Todo App Server is running"));

app.post("/api/v1/signup", async (req, res) => {
  const { email, userName, password } = req.body;
  if (!email || !userName || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  const existing = await UserModel.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ email, userName, password: hash });
  res.status(201).json({ success: true, message: "Signup successful", user });
});

app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ success: false, message: "Incorrect password" });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7h'
  });

  res.json({ success: true, message: "Login successful", token });
});

// Protected - Todos
app.get("/api/v1/todos", AuthUser, async (req, res) => {
  const todos = await TodoModel.find({ userId: req.userId });
  res.json(todos);
});

app.post("/api/v1/todos", AuthUser, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const todo = await TodoModel.create({ title, description, userId: req.userId });
  res.status(201).json(todo);
});

app.put("/api/v1/todos/:id", AuthUser, async (req, res) => {
  const updated = await TodoModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Todo not found" });
  res.json(updated);
});

app.patch("/api/v1/todos/:id/status", AuthUser, async (req, res) => {
  const { status } = req.body;
  if (!["pending", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const todo = await TodoModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status },
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

app.delete("/api/v1/todos/:id", AuthUser, async (req, res) => {
  const deleted = await TodoModel.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!deleted) return res.status(404).json({ message: "Todo not found" });
  res.json({ success: true, message: "Todo deleted" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
