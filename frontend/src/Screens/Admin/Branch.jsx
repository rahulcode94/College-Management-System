import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";

const Branch = () => {
  const [data, setData] = useState({ name: "", branchId: "" });
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    setDataLoading(true);
    try {
      const response = await axiosWrapper.get(`/branch`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setBranches(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        setBranches([]);
      } else {
        toast.error(error.response?.data?.message || "Error fetching branches");
      }
    } finally {
      setDataLoading(false);
    }
  };

  const resetForm = () => {
    setData({ name: "", branchId: "" });
    setSelectedBranchId(null);
    setIsEditing(false);
  };

  const handleEdit = (branch) => {
    setData({ name: branch.name, branchId: branch.branchId });
    setSelectedBranchId(branch._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setSelectedBranchId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.branchId) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setProcessLoading(true);
      toast.loading(isEditing ? "Updating Branch..." : "Adding Branch...");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      let response;
      if (isEditing) {
        response = await axiosWrapper.patch(
          `/branch/${selectedBranchId}`,
          data,
          { headers }
        );
      } else {
        response = await axiosWrapper.post(`/branch`, data, { headers });
      }
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        setShowForm(false);
        getBranches();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setProcessLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Branch...");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      const response = await axiosWrapper.delete(
        `/branch/${selectedBranchId}`,
        { headers }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Branch deleted successfully");
        setIsDeleteConfirmOpen(false);
        getBranches();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Error deleting branch");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      {/* Heading + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <Heading title="Branch Management" />
        <CustomButton
          onClick={() => {
            if (showForm && isEditing) {
              resetForm();
            }
            setShowForm((prev) => !prev);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition duration-200"
        >
          <IoMdAdd className="text-xl" />
          {showForm ? (isEditing ? "Cancel Edit" : "Cancel") : "Add Branch"}
        </CustomButton>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
          ></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-4 p-8 overflow-y-auto max-h-[90vh] transition-transform duration-300">
            <button
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <IoMdClose className="text-2xl" />
            </button>
            <h2 className="text-2xl font-extrabold mb-6 text-gray-800">
              {isEditing ? "Edit Branch" : "Add New Branch"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
                    disabled={processLoading}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Branch ID
                  </label>
                  <input
                    type="text"
                    value={data.branchId}
                    onChange={(e) =>
                      setData({ ...data, branchId: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
                    disabled={processLoading}
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end items-center gap-4">
                <CustomButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-5 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  disabled={processLoading}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="submit"
                  variant="primary"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg transition"
                  disabled={processLoading}
                >
                  {isEditing ? "Update Branch" : "Add Branch"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading */}
      {dataLoading && (
        <div className="flex justify-center mt-10">
          <Loading />
        </div>
      )}

      {/* Table */}
      {!dataLoading && !showForm && (
        <div className="mt-8 overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-left">
              <tr>
                <th className="py-3 px-6 font-semibold">Branch Name</th>
                <th className="py-3 px-6 font-semibold">Branch ID</th>
                <th className="py-3 px-6 font-semibold">Created At</th>
                <th className="py-3 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches && branches.length > 0 ? (
                branches.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">{item.name}</td>
                    <td className="py-4 px-6">{item.branchId}</td>
                    <td className="py-4 px-6">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center flex justify-center gap-2">
                      <CustomButton
                        variant="secondary"
                        className="p-2 rounded-full hover:bg-blue-100 transition"
                        onClick={() => handleEdit(item)}
                      >
                        <MdEdit className="text-blue-600" />
                      </CustomButton>
                      <CustomButton
                        variant="danger"
                        className="p-2 rounded-full hover:bg-red-100 transition"
                        onClick={() => handleDelete(item._id)}
                      >
                        <MdOutlineDelete className="text-red-600" />
                      </CustomButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No branches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this branch?"
      />
    </div>
  );
};

export default Branch;
