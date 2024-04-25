import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../Authorization/api";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    const filterTasks = (tasks) => {
      const filterTodos = tasks.filter((task) => task.status === "todo");
      const filterInProgress = tasks.filter(
        (task) => task.status === "inprogress"
      );
      const filterClosed = tasks.filter((task) => task.status === "closed");
      setTodos(filterTodos);
      setInProgress(filterInProgress);
      setClosed(filterClosed);
    };

    filterTasks(tasks);
  }, [tasks]);

  const sections = [
    { status: "todo", tasks: todos },
    { status: "inprogress", tasks: inProgress },
    { status: "closed", tasks: closed },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-20">
      {sections.map((section, index) => (
        <Section
          key={index}
          status={section.status}
          tasks={tasks}
          setTasks={setTasks}
          sectionTasks={section.tasks}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({ status, tasks, setTasks, sectionTasks }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addItemToSection = async (id) => {
    try {
      const response = await api.put(`/tasks/${id}`, { status });
      if (response.status === 200) {
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) => {
            if (task.id === id) {
              return { ...task, status };
            }
            return task;
          });
          return updatedTasks;
        });
      }
    } catch (error) {
      console.error("Error updating task status:", error.message);
      toast.error("Failed to update task status");
    }
  };

  let text = "";
  let bg = "";
  let textColor = "";
  let taskToMap = sectionTasks;

  switch (status) {
    case "todo":
      text = "Todo";
      bg = "bg-blue-500";
      textColor = "text-white";
      break;
    case "inprogress":
      text = "In Progress";
      bg = "bg-yellow-500";
      textColor = "text-black";
      break;
    case "closed":
      text = "Closed";
      bg = "bg-green-500";
      textColor = "text-white";
      break;
    default:
      break;
  }

  return (
    <div
      ref={drop}
      className={`w-full md:w-64 h-auto md:h-96 mt-4 md:mt-0  ${
        isOver ? "bg-slate-500 rounded-lg shadow-lg" : ""
      }`}
    >
      <Header
        text={text}
        bg={bg}
        count={taskToMap.length}
        textColor={textColor}
      />
      {taskToMap.length > 0 &&
        taskToMap.map((task) => (
          <Task key={task.id} task={task} setTasks={setTasks} />
        ))}
    </div>
  );
};

const Header = ({ text, bg, count, textColor }) => {
  return (
    <div
      className={`${bg} ${textColor} flex items-center h-12 pl-4 rounded-md uppercase text-sm font-semibold`}
    >
      {text}{" "}
      <div className="bg-gray-300 rounded-full text-black w-5 h-5 items-center flex justify-center font-bold ml-2">
        {count}
      </div>
    </div>
  );
};

const Task = ({ task, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleRemove = async (id) => {
    try {
      // Remove task from backend
      const response = await api.delete(`/delete/${id}`);
      if (response.status === 200) {
        // Remove task from frontend
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
        toast.success("Task removed");
      } else {
        toast.error("Failed to remove task");
      }
    } catch (error) {
      console.error("Error removing task:", error.message);
      toast.error("Failed to remove task");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const newName = prompt("Enter the updated task");
      if (newName !== null) {
        const response = await api.put(`/update/${id}`, { name: newName });
        if (response.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === id ? { ...t, name: newName } : t))
          );
          toast.success("Task updated successfully");
        } else {
          toast.error("Failed to update task");
        }
      }
    } catch (error) {
      console.error("Error updating task:", error.message);
      toast.error("Failed to update task");
    }
  };

  return (
    <div
      ref={drag}
      className={`relative p-3 mt-1 shadow-md cursor-grab flex justify-between bg-gray-300 rounded-lg ${
        isDragging ? "opacity-25" : "opacity-100"
      }`}
    >
      <p>{task.name}</p>
      <div>
        <button
          onClick={() => handleUpdate(task.id)}
          className="hover:text-red-500"
        >
          <MdModeEdit />
        </button>
        <button
          onClick={() => handleRemove(task.id)}
          className="hover:text-red-500"
        >
          <IoIosCloseCircleOutline />
        </button>
      </div>
    </div>
  );
};
