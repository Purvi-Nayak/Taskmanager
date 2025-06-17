import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../shared/table";
import { api } from "../../api/client";
import SearchBox from "../../shared/searchtext";
import useDebounce from "../../hooks/useDebounce";
import CustomModal from "../../shared/custommodal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");
  const currentUser = useSelector((state) => state.users.user);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  //  const [filterConfig, setFilterConfig] = useState({ role: '' });

  const debouncedSearch = useDebounce(search, 400);
  const navigate = useNavigate();
  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const taskColumns = [
    {
      id: "title",
      label: "Title",
      field_name: "title",
      render: ({ row }) => <span className="font-medium">{row.title}</span>,
    },
    {
      id: "description",
      label: "Description",
      field_name: "description",
      render: ({ row }) => (
        <span className="text-gray-600">{row.description}</span>
      ),
    },
    {
      id: "dueDate",
      label: "Due Date",
      field_name: "dueDate",
      render: ({ row }) => (
        <span>{new Date(row.dueDate).toLocaleDateString()}</span>
      ),
    },
    {
      id: "status",
      label: "Status",
      field_name: "status",
      render: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.status === "Completed"
              ? "bg-green-100 text-green-800"
              : row.status === "In Progress"
              ? "bg-yellow-100 text-yellow-800"
              : row.status === "Approved"
              ? "bg-blue-100 text-blue-800"
              : row.status === "Rejected"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const handleViewTasks = async (userId, userName) => {
    if (currentUser?.role === "admin") {
      try {
        setLoading(true);
        const response = await api.TASKS.getUserTasks({ userId });
        if (response.data) {
          setSelectedUserTasks(response.data);
          setSelectedUserName(userName);
          setIsTaskModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching user tasks:", error);
      } finally {
        setLoading(false);
      }
    } else if (userId === currentUser.id) {
      navigate("/tasks");
    }
  };

  const columns = [
    {
      id: "name",
      label: "Name",
      field_name: "name",
      sortable: true,
      render: ({ row }) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {row.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="ml-3 font-medium text-gray-900">{row.name}</span>
        </div>
      ),
    },
    {
      id: "email",
      label: "Email",
      field_name: "email",
      sortable: true,

      render: ({ row }) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      id: "role",
      label: "Role",
      field_name: "role",
      sortable: true,
      filterable: true,
      options: ["user", "admin"],
      filterPlaceholder: "Filter by role",
      filterType: "select",

      render: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.role === "user"
              ? "bg-green-100 text-green-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      id: "viewTasks",
      label: "Tasks",
      field_name: "viewTasks",
      sortable: false,
      render: ({ row }) => (
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            currentUser?.role === "admin" || row.id === currentUser.id
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          onClick={() => handleViewTasks(row.id, row.name)}
          disabled={currentUser?.role !== "admin" && row.id !== currentUser.id}
        >
          {currentUser?.role === "admin"
            ? "View User Tasks"
            : row.id === currentUser.id
            ? "View My Tasks"
            : "Not Available"}
        </button>
      ),
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.USERS.getAll();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search functionality
  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedSearch) {
        try {
          setLoading(true);
          const response = await api.USERS.getAll();
          if (response.data) {
            const filteredUsers = response.data.filter(
              (user) =>
                // Filter by role if not admin
                (currentUser.role === "admin" || user.role === "user") &&
                // Search in name and email
                (user.name
                  .toLowerCase()
                  .includes(debouncedSearch.toLowerCase()) ||
                  user.email
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase()))
            );
            setUsers(filteredUsers);
          }
        } catch (error) {
          console.error("Error searching users:", error);
        } finally {
          setLoading(false);
        }
      } else {
        fetchUsers();
      }
    };
    searchUsers();
  }, [debouncedSearch, currentUser.role]);

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="w-64">
          <SearchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          columns={columns}
          data={users}
          emptyMessage="No users found"
          className="w-full"
          onSort={handleSort}
          sortConfig={sortConfig}
            itemsPerPage={5}
        />
      )}

      {/* Tasks Modal */}
      <CustomModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={`Tasks for ${selectedUserName}`}
        size="extra-large"
        className="max-w-8xl bg-gray-300 rounded-lg shadow-lg p-6"
      >
        <div className="mt-4">
          {selectedUserTasks.length > 0 ? (
            <Table
              columns={taskColumns}
              data={selectedUserTasks}
              emptyMessage="No tasks found"
              className="w-full bg-gray-100 max-w-4xl rounded-lg shadow overflow-hidden"
              onRowClick={(row) => {
                if (currentUser?.role === "admin") {
                  navigate(`/tasks/${row.id}`);
                } else if (row.userId === currentUser.id) {
                  navigate(`/tasks/${row.id}`);
                }
              }}
              rowClassName="cursor-pointer hover:bg-gray-200"
            />
          ) : (
            <p className="text-center text-gray-500">
              No tasks found for this user
            </p>
          )}
        </div>
      </CustomModal>
    </div>
  );
};

export default Users;
