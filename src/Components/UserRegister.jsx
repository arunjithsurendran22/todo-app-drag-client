import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Authorization/api";

function UserRegister() {
  const inputFocus = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Validate input fields in real-time
    validateField(id, value);
  };

  useEffect(() => {
    inputFocus.current.focus();
  }, []);

  const validateField = (field, value) => {
    let error = "";
    if (field === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!value.includes("@")) {
        error = "Email must contain @";
      } else {
        error = "";
      }
    } else if (field === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters long";
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value)
      ) {
        error =
          "Password must contain at least one uppercase letter, one lowercase letter, and one special character (@, $, !, %, *, ?, or &)";
      } else {
        error = "";
      }
    } else if (field === "name") {
      if (!value) {
        error = "Name is required";
      } else if (!/^[A-Za-z]+$/.test(value)) {
        error = "Name must contain only alphabets";
      } else {
        error = "";
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await api.post("/register", formData);
        console.log("Registration successful:", response.data);
        if (response.data.message === "Registered Successfully") {
          navigate("/");
          toast.success("User registered successfully");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        // Handle backend validation errors
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          console.log("Register failed", error);
        }
      }
    }
  };

  const validateForm = () => {
    const nameError = errors.name;
    const emailError = errors.email;
    const passwordError = errors.password;
    return nameError === "" && emailError === "" && passwordError === "";
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <div className="max-w-md w-full mx-4 p-6 rounded-lg bg-gray-800 shadow-lg">
        <h1 className="font-bold md:text-3xl text-cyan-600 text-center mt-4 mb-10 italic">
          REGISTER USER
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            ref={inputFocus}
            type="text"
            id="name"
            placeholder="Name"
            className={`bg-gray-700 text-gray-100 p-2 md:p-3 rounded-lg shadow-inner focus:outline-none ${
              errors.name && "border-red-500"
            } sm:w-full `}
            onChange={handleChange}
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
          <input
            type="email"
            id="email"
            placeholder="Email"
            className={`bg-gray-700 text-gray-100 p-2 md:p-3 rounded-lg shadow-inner focus:outline-none ${
              errors.email && "border-red-500"
            } sm:w-full `}
            onChange={handleChange}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
          <input
            type="password"
            id="password"
            placeholder="Password"
            className={`bg-gray-700 text-gray-100 p-2 md:p-3 rounded-lg shadow-inner focus:outline-none ${
              errors.password && "border-red-500"
            } sm:w-full `}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 md:p-3 rounded-lg shadow-md hover:bg-indigo-900 focus:outline-none mt-4 font-bold"
          >
            REGISTER
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-300 italic">Have an Account ?</span>
          <Link to="/">
            <span className="text-blue-400 mx-2 font-bold">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
