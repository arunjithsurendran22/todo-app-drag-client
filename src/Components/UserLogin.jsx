import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Authorization/api";

function UserLogin() {
  const inputFocus = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    inputFocus.current.focus();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.email || !formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = "Email is not in valid format";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginToken = (token) => {
    localStorage.setItem("accessTokenUser", token.accessTokenUser);
    localStorage.setItem("refreshTokenUser", token.refreshTokenUser);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await api.post("/login", formData);
        console.log(response.data);
        if (response.data.message === "User Login successful") {
          toast.success("Login Successfully");
          handleLoginToken(response.data);
          navigate("/home");
        } else {
          toast.error(response.data.message);
          setFormData({ ...formData, password: "" });
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Login failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <div className="max-w-xl w-3/12 mx-auto p-8 rounded-lg bg-gray-800 shadow-lg">
        <h1 className="font-bold text-3xl  text-cyan-600 text-center mt-8 italic">
          LOGIN
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-80">
          <input
            ref={inputFocus}
            type="email"
            id="email"
            placeholder="Email"
            className={`bg-gray-700 text-gray-100 p-4 rounded-lg shadow-inner mt-20 focus:outline-none ${
              errors.email && "border-red-500"
            }`}
            onChange={handleChange}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
          <input
            type="password"
            id="password"
            placeholder="Password"
            className={`bg-gray-700 text-gray-100 p-4 rounded-lg shadow-inner focus:outline-none ${
              errors.password && "border-red-500"
            }`}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white p-4 rounded-lg shadow-md hover:bg-indigo-900 focus:outline-none mt-4 font-bold"
          >
            LOGIN
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-300 italic">Don't have an Account ?</span>
          <Link to="/register">
            <span className="text-blue-400 mx-2 font-bold">Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
