import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Exam from "../Exam";
import {
  FaHome,
  FaCalendarAlt,
  FaBook,
  FaBullhorn,
  FaUserGraduate,
  FaClipboardCheck,
  FaFileAlt,
} from "react-icons/fa";
import Loading from "../../components/Loading";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null, icon: <FaHome /> },
  { id: "timetable", label: "Timetable", component: Timetable, icon: <FaCalendarAlt /> },
  { id: "material", label: "Material", component: Material, icon: <FaBook /> },
  { id: "notice", label: "Notice", component: Notice, icon: <FaBullhorn /> },
  { id: "student-info", label: "Student Info", component: StudentFinder, icon: <FaUserGraduate /> },
  { id: "marks", label: "Marks", component: Marks, icon: <FaClipboardCheck /> },
  { id: "exam", label: "Exam", component: Exam, icon: <FaFileAlt /> },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        toast.error("Error fetching profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

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

    if (selectedMenu === "home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    const selectedItem = MENU_ITEMS.find((item) => item.id === selectedMenu);
    const Component = selectedItem?.component;

    return Component ? <Component /> : null;
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
                onClick={() => setSelectedMenu(item.id)}
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
