import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTask } from "../../redux/slices/taskSlice";
import Table from "../../components/table";
import SearchBox from "../../shared/SearchText";
import { api } from "../../api/client";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Fetch both users and tasks
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, tasksResponse] = await Promise.all([
        api.USERS.getAll(),
        api.TASKS.getUserTasks({

        })  // No userId filter for admin
      ]);

      if (usersResponse.data) {
        setUsers(usersResponse.data);
      }
      if (tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (task) => {
  try {
    const response = await api.TASKS.updateStatus({
      taskId: task.id,
      data:{
        ...task,
        status: "Approved"
      }
    });
    if (response.data) {
      setTasks(prevTasks => 
        prevTasks.map(data => 
          data.id === task.id ? { status: "Approved",...data,  } : data
        )
      );
    }
  } catch (error) {
    console.error("Error approving task:", error);
  }
};

  const handleReject = async (task) => {
    console.log('--------------task--------------', task);
    try {
      const response = await api.TASKS.updateStatus({
        taskId: task.id,
        data:{
          ...task,
          status: "Rejected"
        }
      });
      console.log("Reject response:", response.data);
      console.log("Reject request data:", response);
      if (response.data) {
        // Update just the modified task in the local state
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === task.id ? { ...t, status: "Rejected" } : t
          )
        );
         
      }
    } catch (error) {
      console.error("Error rejecting task:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch both users and tasks in parallel
        const [usersResponse, tasksResponse] = await Promise.all([
          api.USERS.getAll(),
          api.TASKS.getAllTasks() // New API endpoint for all tasks
        ]);

        if (usersResponse.data) {
          setUsers(usersResponse.data);
        }
        if (tasksResponse.data) {
          setTasks(tasksResponse.data);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Run only once on component mount

  const columns = [
    {
      id: "title",
      label: "Task",
      field_name: "title",
      render: ({ row }) => (
        <div className="px-6 py-4">{row.title}</div>
      )
    },
    {
      id: "user",
      label: "User",
      field_name: "userId",
      render: ({ row }) => {
        // Add null check for userId
        if (!row.userId) return <div className="px-6 py-4">-</div>;
        
        const user = users?.find((u) => u.id === row.userId);
        return (
          <div className="px-6 py-4">
            {user?.name || "Unknown User"}
          </div>
        );
      }
    },
    {
      id: "status",
      label: "Status",
      field_name: "status",
      render: ({ row }) => (
        <div className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              row.status === "Completed"
                ? "bg-green-100 text-green-800"
                : row.status === "In Progress"
                ? "bg-yellow-100 text-yellow-800"
                : row.status === "Pending"
                ? "bg-gray-100 text-gray-800"
                : row.status === "Approved"
                ? "bg-blue-100 text-blue-800"
                : row.status === "Rejected"
                ? "bg-red-100 text-red-800"
                : ""
            }`}
          >
            {row.status}
          </span>
        </div>
      )
    },
    {
      id: "dueDate",
      label: "Due Date",
      field_name: "dueDate",
      render: ({ row }) => (
        <div className="px-6 py-4">{row.dueDate}</div>
      )
    },
    {
      id: "actions",
      label: "Actions",
      render: ({ row }) => {
        if (!row) return null;
    
        const canApproveOrReject = !["Approved", "Rejected"].includes(row.status);
  

        return (
          <div className="px-6 py-4">
            {canApproveOrReject && (
              <>
                <button
                  onClick={() => handleApprove(row)}
                  className="text-green-600 mr-2 hover:text-green-800"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(row)}
                  className="text-red-600 hover:text-red-800"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  // Filter tasks based on search and status
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      if (!task) return false;
      
      const user = users.find((u) => u.id === task.userId);
      const searchTerm = search.toLowerCase().trim();
      const taskTitle = task.title?.toLowerCase() || '';
      const userName = user?.name?.toLowerCase() || '';

      const matchesSearch = !searchTerm || 
        taskTitle.includes(searchTerm) || 
        userName.includes(searchTerm);

      const matchesStatus = !statusFilter || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, users, search, statusFilter]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">All Tasks</h2>
        <div className="mb-4 flex gap-4">
          <SearchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <Table 
          columns={columns}
          data={filteredTasks}
          emptyMessage="No tasks found"
          className="w-full bg-white rounded-lg shadow overflow-hidden"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
