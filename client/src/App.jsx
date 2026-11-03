import { useEffect, useMemo, useState } from "react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Something went wrong");
    return data;
  }

  async function loadTasks() {
    try {
      setError("");
      setTasks(await request("/api/tasks"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const task = await request("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title })
      });
      setTasks((current) => [task, ...current]);
      setTitle("");
      setError("");
    } catch (err) { setError(err.message); }
  }

  async function toggleTask(task) {
    try {
      const updated = await request(`/api/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !task.completed })
      });
      setTasks((current) => current.map((item) => item._id === updated._id ? updated : item));
    } catch (err) { setError(err.message); }
  }

  async function deleteTask(id) {
    try {
      await request(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (err) { setError(err.message); }
  }

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }), [tasks, filter]);

  const remaining = tasks.filter((task) => !task.completed).length;

  return (
    <main className="page">
      <section className="app-card">
        <div className="eyebrow">MY WORKSPACE</div>
        <h1>Task Manager<span>.</span></h1>
        <p className="subtitle">A little progress every day adds up.</p>

        <form className="add-form" onSubmit={addTask}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What do you need to do?"
            maxLength={120}
            aria-label="New task"
          />
          <button type="submit">Add task</button>
        </form>

        {error && <div className="error" role="alert">{error}</div>}

        <div className="toolbar">
          <span>{remaining} task{remaining === 1 ? "" : "s"} left</span>
          <div className="filters" aria-label="Filter tasks">
            {["all", "active", "completed"].map((value) => (
              <button
                key={value}
                type="button"
                className={filter === value ? "filter active-filter" : "filter"}
                onClick={() => setFilter(value)}
              >{value[0].toUpperCase() + value.slice(1)}</button>
            ))}
          </div>
        </div>

        {loading ? <p className="empty">Loading your tasks…</p> :
          visibleTasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✓</div>
              <strong>{tasks.length === 0 ? "Your list is clear" : "No tasks in this view"}</strong>
              <p>{tasks.length === 0 ? "Add your first task above to get started." : "Try another filter."}</p>
            </div>
          ) : (
            <ul className="task-list">
              {visibleTasks.map((task) => (
                <li className="task" key={task._id}>
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />
                    <span className={task.completed ? "task-title done" : "task-title"}>{task.title}</span>
                  </label>
                  <button className="delete" type="button" onClick={() => deleteTask(task._id)} aria-label={`Delete ${task.title}`}>×</button>
                </li>
              ))}
            </ul>
          )}
        <footer>Built with MongoDB · Express · React · Node.js</footer>
      </section>
    </main>
  );
}
