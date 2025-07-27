import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Todo = () => {
  const [taskList, setTaskList] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" });
  const [showModal, setShowModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: decoded.email });
    } catch (e) {
      console.error("Invalid token",e.message);
    }

    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTaskList(data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTimeout(() => navigate("/login"), 1000); // Immediately go to login
  };
  

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;

    const token = localStorage.getItem("token");
    console.log(token)
    try {
      const res = await fetch(`${API}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`

        },
        body: JSON.stringify(newTask),
      });

      if (res.ok) {
        const created = await res.json();
        setTaskList([...taskList, created]);
        resetForm();
      }
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const deleteTask = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`
        },
      });

      if (res.ok) {
        setTaskList(taskList.filter((task) => task._id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "completed" ? "pending" : "completed";
    const confirm = window.confirm(`Mark task as ${nextStatus}?`);
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/todos/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`

        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTaskList(taskList.map((task) => (task._id === id ? updated : task)));
      }
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const openUpdateModal = (task) => {
    setNewTask({ title: task.title, description: task.description, priority: task.priority });
    setEditTaskId(task._id);
    setIsUpdateMode(true);
    setShowModal(true);
  };

  const updateTask = async () => {
    if (!newTask.title.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/todos/${editTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`

        },
        body: JSON.stringify(newTask),
      });

      if (res.ok) {
        const updated = await res.json();
        setTaskList(taskList.map((task) => (task._id === editTaskId ? updated : task)));
        resetForm();
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const resetForm = () => {
    setNewTask({ title: "", description: "", priority: "medium" });
    setShowModal(false);
    setIsUpdateMode(false);
    setEditTaskId(null);
  };

  const getBorderColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-500";
      case "medium":
        return "border-purple-700";
      case "low":
        return "border-gray-400";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 text-white px-4">
      <header className="w-full bg-gray-800 text-white text-2xl font-bold p-4 shadow flex justify-between items-center">
        Task Manager

        {user && (
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="text-white text-2xl">
              <FaUserCircle />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow w-56 p-4 z-50">
                <p className="text-sm font-semibold">Logged in as:</p>
                <p className="text-sm mb-2 break-all">{user.email}</p>
                <hr className="my-2" />
                <button
                  onClick={logout}
                  className="text-red-600 hover:underline text-sm cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {taskList.map((task) => (
          <div
            key={task._id}
            className={`w-[300px] bg-white text-black rounded-xl shadow-md border-l-4 p-4 ${getBorderColor(
              task.priority
            )} ${task.status === "completed" ? "opacity-60" : ""}`}
          >
            <h2 className={`text-lg font-bold ${task.status === "completed" ? "line-through" : ""}`}>
              {task.title}
            </h2>
            <p
              className={`text-sm mt-1 mb-4 ${
                task.status === "completed" ? "line-through text-gray-500" : "text-gray-700"
              }`}
            >
              {task.description}
            </p>
            <p className="text-xs italic mb-2">
              Status:{" "}
              <span className={task.status === "completed" ? "text-green-600" : "text-yellow-500"}>
                {task.status}
              </span>
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => toggleStatus(task._id, task.status)}
                className={`${
                  task.status === "pending"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                } text-white px-3 py-1 rounded text-sm`}
              >
                {task.status === "pending" ? "Mark Completed" : "Mark Pending"}
              </button>
              <button
                onClick={() => openUpdateModal(task)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Update
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
      >
        <FaPlus />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
            <button
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
              onClick={resetForm}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isUpdateMode ? "Update Task" : "Create Task"}
            </h2>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={newTask.title}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
            <textarea
              name="description"
              placeholder="Enter description"
              value={newTask.description}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
              rows={4}
            />
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
              className="hidden"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={isUpdateMode ? updateTask : addTask}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {isUpdateMode ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
