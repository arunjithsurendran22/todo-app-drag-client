import React, { useEffect, useState } from "react";
import CreateTask from "./CreateTask";
import ListTasks from "./ListTasks";
import api from "../Authorization/api";
import Navbar from "./Navbar";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/get");
        if (response.status === 200) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    fetchTasks();
  }, [tasks]);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center bg-slate-500 h-screen">
        <div className="flex flex-col mt-10">
          <CreateTask setTasks={setTasks} />
          <ListTasks tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </div>
  );
};

export default Home;
