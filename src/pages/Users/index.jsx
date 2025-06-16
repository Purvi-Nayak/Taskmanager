import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../shared/table";
import { api } from "../../api/client";
import SearchBox from "../../shared/searchtext";
import useDebounce from "../../hooks/useDebounce";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const currentUser = useSelector((state) => state.users.user);
  const debouncedSearch = useDebounce(search, 400);
  const navigate = useNavigate();

  const handleViewTasks = (userId) => {
    // Only allow viewing tasks if it's the logged-in user
    if (userId === currentUser.id) {
      navigate("/tasks"); // Navigate to tasks page
    }
  };

  const columns = [
    {
      id: "name",
      label: "Name",
      field_name: "name",
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
      render: ({ row }) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      id: "role",
      label: "Role",
      field_name: "role",
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
      render: ({ row }) => (
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            row.id === currentUser.id
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          onClick={() => handleViewTasks(row.id)}
          disabled={row.id !== currentUser.id}
        >
          {row.id === currentUser.id ? "View My Tasks" : "Not Available"}
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
        />
      )}
    </div>
  );
};

export default Users;
