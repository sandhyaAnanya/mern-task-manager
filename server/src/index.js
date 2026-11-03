import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Task from "./models/Task.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
    : "http://localhost:5173"
}));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Task Manager API is running" });
});

app.get("/api/tasks", async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Could not load tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const title = String(req.body.title ?? "").trim();
    if (!title) return res.status(400).json({ message: "Task title is required" });
    const task = await Task.create({ title });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Could not create task" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: Boolean(req.body.completed) },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch {
    res.status(400).json({ message: "Invalid task ID or update" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch {
    res.status(400).json({ message: "Invalid task ID" });
  }
});

const port = process.env.PORT || 5000;
// log(`Starting server on port ${port}...`);
console.log(`Connecting to MongoDB at ${process.env.MONGODB_URI}...`);
try {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing");
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  app.listen(port, () => console.log(`API listening on port ${port}`));
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}
