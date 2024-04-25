import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import api from "../Authorization/api";

const CreateTask = ({ setTasks }) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (task.name.length < 3) {
      return toast.error("Task must have more than 3 characters");
    }
    if (task.name.length > 100) {
      return toast.error("Task cannot be more than 100 characters");
    }

    try {
      const response = await api.post("/create", {
        name: task.name,
        id: uuidv4(),
      });

      if (response.status === 201) {
        setTask({ id: "", name: "", status: "todo" });
        setTasks(prevTasks => [...prevTasks, response.data]);
        toast.success("Task added successfully!");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to create task");
    }
  };

  return (
    <div>
      <form className="flex items-center" onSubmit={handleSubmit}>
        <input
          className="border rounded-md py-2 px-4 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          type="text"
          placeholder="Enter the text..."
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default CreateTask;