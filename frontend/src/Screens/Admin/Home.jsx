import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import Admin from "./Admin";
import Branch from "./Branch";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Profile from "./Profile";
import Exam from "../Exam";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaChalkboardTeacher,
  FaBook,
  FaBuilding,
  FaBullhorn,
  FaClipboardList,
  FaUsers,
  FaHome,
} from "react-icons/fa";
import Loading from "../../components/Loading";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: Profile, icon: <FaHome /> },
  { id: "student", label: "Student", component: Student, icon: <FaUsers /> },
  { id: "faculty", label: "Faculty", component: Faculty, icon: <FaChalkboardTeacher /> },
  { id: "branch", label: "Branch", component: Branch, icon: <FaBuilding /> },
  { id: "notice", label: "Notice", component: Notice, icon: <FaBullhorn /> },
  { id: "exam", label: "Exam", component: Exam, icon: <FaClipboardList /> },
  { id: "subjects", label: "Subjects", component: Subjects, icon: <FaBook /> },
  { id: "admin", label: "Admin", component: Admin, icon: <FaUser /> },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      toast.loading("Loading user details...");
      const response = await axiosWrapper.get(`/admin/my-details`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching user details");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pathMenuId = urlParams.get("page") || "home";
    const validMenu = MENU_ITEMS.find((item) => item.id === pathMenuId);
    setSelectedMenu(validMenu ? validMenu.id : "home");
  }, [location.search]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu === menuId;
    return `
      flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm
      transition duration-300 ease-in-out cursor-pointer
      ${
        isSelected
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105"
          : "text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-blue-600"
      }
    `;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      );
    }

    const MenuItem = MENU_ITEMS.find((item) => item.id === selectedMenu)?.component;

    if (selectedMenu === "home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    return MenuItem && <MenuItem />;
  };

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/admin?page=${menuId}`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Top Menu */}
        <div className="bg-white shadow-md rounded-xl p-4 mb-8 border border-gray-200">
          <ul className="flex flex-wrap justify-center gap-3 md:gap-5">
            {MENU_ITEMS.map((item) => (
              <li
                key={item.id}
                className={getMenuItemClass(item.id)}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          {renderContent()}
        </div>
      </div>

      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
