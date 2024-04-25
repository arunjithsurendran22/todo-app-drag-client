import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Authorization/api";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/profile/get");
        if (response.status === 200) {
          setUserName(response.data.userProfile.name);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex items-center">
            <h1 className="text-white font-semibold md:text-lg">TODO APP</h1>
          </div>
          <div className="flex items-center">
            <span className="text-white mr-4">{userName}</span>
            <button
              onClick={handleLogout}
              className=" hover:bg-red-600 text-white px-4 py-2 rounded-full"
            >
              <MdLogout />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
