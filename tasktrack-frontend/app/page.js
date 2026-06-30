"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const API_URL = "http://localhost:3001";
const statuses = ["todo", "doing", "done"];

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("todo");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTodos() {
    try {
      setError("");
      const response = await fetch(`${API_URL}/todos`);

      if (!response.ok) {
        throw new Error("Could not load todos");
      }

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(event) {
    event.preventDefault();

    if (!task.trim()) {
      setError("Please enter a task.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: task.trim(),
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not add todo");
      }

      const newTodo = await response.json();
      setTodos((currentTodos) => [...currentTodos, newTodo]);
      setTask("");
      setTags("");
      setStatus("todo");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(todo, nextStatus) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error("Could not update todo");
      }

      const updatedTodo = await response.json();
      setTodos((currentTodos) =>
        currentTodos.map((item) =>
          item.id === updatedTodo.id ? updatedTodo : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTodo(id) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete todo");
      }

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div>
          <p className={styles.kicker}>Express API + Next.js UI</p>
          <h1>TaskTrack</h1>
        </div>
      </section>

      <form className={styles.form} onSubmit={addTodo}>
        <label>
          Task
          <input
            value={task}
            onChange={(event) => setTask(event.target.value)}
            placeholder="Build the project dashboard"
          />
        </label>

        <label>
          Tags
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="NodeJS, frontend"
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </label>

        <button disabled={saving}>{saving ? "Adding..." : "Add todo"}</button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.todoList}>
        {loading ? <p className={styles.empty}>Loading todos...</p> : null}

        {!loading && todos.length === 0 ? (
          <p className={styles.empty}>No todos yet.</p>
        ) : null}

        {todos.map((todo) => (
          <article className={styles.todo} key={todo.id}>
            <div>
              <h2>{todo.task}</h2>
              <div className={styles.tags}>
                {todo.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <select
                aria-label={`Change status for ${todo.task}`}
                value={todo.status}
                onChange={(event) => updateStatus(todo, event.target.value)}
              >
                {statuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
