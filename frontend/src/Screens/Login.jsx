import React, { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi"; // Login icon
import axiosWrapper from "../utils/AxiosWrapper"; // Axios wrapper for API requests
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // For toast notifications
import { useDispatch } from "react-redux";
import { setUserToken } from "../redux/actions"; // Redux action to set token
import CustomButton from "../components/CustomButton"; // Reusable styled button
// User types for login
const USER_TYPES = {
  STUDENT: "Student", FACULTY: "Faculty", ADMIN: "Admin",
};

// -------------------- Login Form Component --------------------
const LoginForm = ({ selected, onSubmit, formData, setFormData }) => (
  <form
    className="w-full p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20"
    onSubmit={onSubmit}
  >
    {/* Email input */}
    <div className="mb-6">
      <label className="block text-white/90 text-sm font-medium mb-2" htmlFor="email">
        {selected} Email
      </label>
      <input
        type="email"
        id="email"
        required
        className="w-full px-4 py-2 text-sm text-white bg-white/5 border border-white/30 rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="you@example.com"
      />
    </div>

    {/* Password input */}
    <div className="mb-6">
      <label className="block text-white/90 text-sm font-medium mb-2" htmlFor="password">
        Password
      </label>
      <input
        type="password"
        id="password"
        required
        className="w-full px-4 py-2 text-sm text-white bg-white/5 border border-white/30 rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Enter your password"
      />
    </div>

    {/* Forgot password link */}
    <div className="flex items-center justify-between mb-6">
      <Link className="text-sm text-blue-400 hover:underline" to="/forget-password">
        Forgot Password?
      </Link>
    </div>

    {/* Submit button */}
    <CustomButton
      type="submit"
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2"
    >
      Login <FiLogIn className="text-lg" />
    </CustomButton>
  </form>
);

// -------------------- User Type Selector --------------------
const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="flex justify-center gap-4 mb-8">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 backdrop-blur-md 
          ${selected === type
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105"
            : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
          }`}
      >
        {type}
      </button>
    ))}
  </div>
);

// -------------------- Main Login Component --------------------
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type"); // Check URL param (?type=student/faculty/admin)

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Selected user type (default: Student)
  const [selected, setSelected] = useState(USER_TYPES.STUDENT);

  // Handle user type selection
  const handleUserTypeSelect = (type) => {
    const userType = type.toLowerCase();
    setSelected(type);
    setSearchParams({ type: userType }); // Update URL with selected type
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // API call (axiosWrapper handles baseURL, etc.)
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Extract token and save it
      const { token } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);

      // Update redux store
      dispatch(setUserToken(token));

      // Navigate to user dashboard
      navigate(`/${selected.toLowerCase()}`);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  // Auto-select type from URL (if present)
  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center px-4">
      {/* Login container */}
      <div className="w-full max-w-2xl px-6 py-12 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/10">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8 drop-shadow">
          {selected} Login
        </h1>

        {/* User type switcher */}
        <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />

        {/* Login form */}
        <LoginForm
          selected={selected}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      {/* Toast notifications */}
      <Toaster position="bottom-center" />
    </div>
  );
};
export default Login;
