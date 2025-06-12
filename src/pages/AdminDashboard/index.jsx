import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTask } from "../../redux/slices/taskSlice"; // Add this action if not present
import SearchBox from "../../shared/SearchText";

const AdminDashboard = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { usersList } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const dispatch = useDispatch();

  // Pending tasks
  const pendingTasks = tasks.filter((task) => task.status === "Pending");

  // All tasks with filters
  const filteredTasks = tasks.filter((task) => {
    const user = usersList.find((u) => u.id === task.userId);
    const matchesSearch =
      search === "" ||
      (task.title + (user?.name || ""))
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (task) => {
    dispatch(updateTask({ ...task, status: "Approved" }));
  };

  const handleReject = (task) => {
    dispatch(updateTask({ ...task, status: "Rejected" }));
  };

  return (
    <div className="p-6">
    
  

      {/* All Tasks */}
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
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const user = usersList.find((u) => u.id === task.userId);
                const canApproveOrReject = !["Approved", "Rejected"].includes(
                  task.status
                );
                return (
                  <tr key={task.id}>
                    <td className="px-6 py-4">{task.title}</td>
                    <td className="px-6 py-4">{user?.name || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status === "Pending"
                            ? "bg-gray-100 text-gray-800"
                            : task.status === "Approved"
                            ? "bg-blue-100 text-blue-800"
                            : task.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : ""
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{task.dueDate}</td>
                    <td className="px-6 py-4">
                      {canApproveOrReject && (
                        <>
                          <button
                            onClick={() => handleApprove(task)}
                            className="text-green-600 mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(task)}
                            className="text-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredTasks.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
