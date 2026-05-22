import React, { useState } from "react";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import CustomButton from "../../components/CustomButton";

const Profile = ({ profileData }) => {
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-8 mb-12 border-b pb-8">
        <div className="flex items-center gap-8">
          <img
            src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover ring-4 ring-blue-600 ring-offset-4 shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              {`${profileData.firstName} ${profileData.lastName}`}
            </h1>
            <p className="text-lg text-gray-600 mb-1">
              Employee ID:{" "}
              <span className="font-semibold text-gray-800">
                {profileData.employeeId}
              </span>
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {profileData.designation}
              {profileData.isSuperAdmin && (
                <span className="ml-2 px-2 py-0.5 text-sm rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  Super Admin
                </span>
              )}
            </p>
          </div>
        </div>
        <CustomButton
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition"
          onClick={() => setShowUpdatePasswordModal(true)}
        >
          Update Password
        </CustomButton>
        {showUpdatePasswordModal && (
          <UpdatePasswordLoggedIn
            onClose={() => setShowUpdatePasswordModal(false)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Email", value: profileData.email },
              { label: "Phone", value: profileData.phone },
              { label: "Gender", value: profileData.gender, capitalize: true },
              { label: "Blood Group", value: profileData.bloodGroup },
              { label: "Date of Birth", value: formatDate(profileData.dob) },
              {
                label: "Joining Date",
                value: formatDate(profileData.joiningDate),
              },
              {
                label: "Salary",
                value: `₹${profileData.salary.toLocaleString()}`,
              },
              { label: "Status", value: profileData.status, capitalize: true },
              {
                label: "Role",
                value: profileData.isSuperAdmin ? "Super Admin" : "Admin",
              },
            ].map((field, index) => (
              <div key={index}>
                <label className="text-sm font-medium text-gray-500">
                  {field.label}
                </label>
                <p
                  className={`text-gray-900 ${
                    field.capitalize ? "capitalize" : ""
                  }`}
                >
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Address", value: profileData.address },
              { label: "City", value: profileData.city },
              { label: "State", value: profileData.state },
              { label: "Pincode", value: profileData.pincode },
              { label: "Country", value: profileData.country },
            ].map((field, index) => (
              <div key={index}>
                <label className="text-sm font-medium text-gray-500">
                  {field.label}
                </label>
                <p className="text-gray-900">{field.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Name",
                value: profileData.emergencyContact.name,
              },
              {
                label: "Relationship",
                value: profileData.emergencyContact.relationship,
              },
              {
                label: "Phone",
                value: profileData.emergencyContact.phone,
              },
            ].map((field, index) => (
              <div key={index}>
                <label className="text-sm font-medium text-gray-500">
                  {field.label}
                </label>
                <p className="text-gray-900">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
