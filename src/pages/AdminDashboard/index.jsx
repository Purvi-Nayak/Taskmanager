// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { updateTask } from "../../redux/slices/taskSlice";
// import Table from "../../shared/table";

// import { api } from "../../api/client";
// import CustomButton from "../../shared/custombutton";
// import { useLocation, useNavigate } from "react-router-dom";
// import SearchBox from "../../shared/SearchText";
// import CustomModal from "../../shared/custommodal";
// import { FaEllipsisV } from "react-icons/fa";
// import { FaTimes, FaTrash, FaCheck } from "react-icons/fa";
// import CustomMenuButton from "../../shared/custommenu-button";

// const AdminDashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [open, setopen] = useState(true);
//   const [deleteId, setDeleteId] = useState(null);

//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const handleTaskAction = (action, task) => {
//     switch (action) {
//       case "Approve":
//         handleApprove(task);
//         break;
//       case "Reject":
//         handleReject(task);
//         break;
//       case "Delete":
//         handleDelete(task.id);
//         break;
//       default:
//         break;
//     }
//   };

//   const getTaskMenuItems = (task) => [
//     {
//       label: "Approve",
//       icon: <FaCheck className="text-green-500" />,
//       onClick: () => handleTaskAction("Approve", task),
//     },
//     {
//       label: "Reject",
//       icon: <FaTimes className="text-red-500" />,
//       onClick: () => handleTaskAction("Reject", task),
//     },
//     {
//       label: "Delete",
//       icon: <FaTrash className="text-red-500" />,
//       onClick: () => handleTaskAction("Delete", task),
//     },
//   ];
//   const handleSort = () => {
//     const newSortConfig = {
//       key: "title",
//       direction: sortConfig.direction === "asc" ? "desc" : "asc",
//     };
//     setSortConfig(newSortConfig);
//     setTasks((prevTasks) =>
//       [...prevTasks].sort((a, b) => {
//         if (newSortConfig.direction === "asc") {
//           return a.title.localeCompare(b.title);
//         } else {
//           return b.title.localeCompare(a.title);
//         }
//       })
//     );
//   };

//   useEffect(() => {
//     // Get userId from URL query params
//     const params = new URLSearchParams(location.search);
//     const userId = params.get("userId");
//     setSelectedUserId(userId);
//   }, [location]);

//   // Fetch both users and tasks
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [usersResponse, tasksResponse] = await Promise.all([
//         api.USERS.getAll(),
//         selectedUserId
//           ? api.TASKS.getUserTasks({ userId: selectedUserId })
//           : api.TASKS.getAllTasks(),
//       ]);

//       if (usersResponse.data) {
//         setUsers(usersResponse.data);
//       }
//       if (tasksResponse.data) {
//         setTasks(tasksResponse.data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleDelete = (taskId) => {
//     setDeleteId(taskId);
//   };
//   const handleConfirmDelete = async () => {
//     try {
//       await api.TASKS.delete({ id: deleteId });
//       // Update local state
//       setTasks(tasks.filter((task) => task.id !== deleteId));
//       // Close the modal
//       setDeleteId(null);
//       // Refresh the tasks
//       await fetchTasks();
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, [selectedUserId]);
//   const handleApprove = async (task) => {
//     try {
//       const response = await api.TASKS.updateStatus({
//         taskId: task.id,
//         data: {
//           ...task,
//           status: "Approved",
//           updatedAt: new Date().toISOString(),
//         },
//       });

//       if (response.data) {
//         setSuccessMessage("Task has been approved successfully!");
//         setErrorMessage("");
//         setopen(true);
//         // Update tasks list
//         dispatch(updateTask(response.data));
//         // Update local state
//         setTasks((prevTasks) =>
//           prevTasks.map((t) => (t.id === task.id ? response.data : t))
//         );
//       }
//     } catch (error) {
//       console.error("Error approving task:", error);
//     }
//   };

//   const handleReject = async (task) => {
//     try {
//       const response = await api.TASKS.updateStatus({
//         taskId: task.id,
//         data: {
//           ...task,
//           status: "Rejected",
//           updatedAt: new Date().toISOString(),
//         },
//       });

//       if (response.data) {
//         setErrorMessage("Task has been rejected");
//         setSuccessMessage("");
//         setopen(true);
//         // Update tasks list
//         dispatch(updateTask(response.data));
//         // Update local state
//         setTasks((prevTasks) =>
//           prevTasks.map((t) => (t.id === task.id ? response.data : t))
//         );
//       }
//     } catch (error) {
//       console.error("Error rejecting task:", error);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         // Fetch both users and tasks in parallel
//         const [usersResponse, tasksResponse] = await Promise.all([
//           api.USERS.getAll(),
//           api.TASKS.getAllTasks(), // New API endpoint for all tasks
//         ]);

//         if (usersResponse.data) {
//           setUsers(usersResponse.data);
//         }
//         if (tasksResponse.data) {
//           setTasks(tasksResponse.data);
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []); // Run only once on component mount

//   const columns = [
//     {
//       id: "title",
//       label: "Task",
//       field_name: "title",
//       sortable: true,

//       render: ({ row }) => <div className="px-6 py-4">{row.title}</div>,
//     },
//     {
//       id: "user",
//       label: "User",
//       field_name: "userId",
//       sortable: true,

//       render: ({ row }) => {
//         // Add null check for userId
//         if (!row.userId) return <div className="px-6 py-4">-</div>;

//         const user = users?.find((u) => u.id === row.userId);
//         return <div className="px-6 py-4">{user?.name || "Unknown User"}</div>;
//       },
//     },
//     {
//       id: "status",
//       label: "Status",
//       field_name: "status",
//       sortable: true,

//       render: ({ row }) => (
//         <div className="px-6 py-4">
//           <span
//             className={`px-2 py-1 text-xs font-semibold rounded-full ${
//               row.status === "Completed"
//                 ? "bg-green-100 text-green-800"
//                 : row.status === "In Progress"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : row.status === "Pending"
//                 ? "bg-gray-100 text-gray-800"
//                 : row.status === "Approved"
//                 ? "bg-blue-100 text-blue-800"
//                 : row.status === "Rejected"
//                 ? "bg-red-100 text-red-800"
//                 : ""
//             }`}
//           >
//             {row.status}
//           </span>
//         </div>
//       ),
//     },
//     {
//       id: "dueDate",
//       label: "Due Date",
//       field_name: "dueDate",
//       sortable: true,
//       render: ({ row }) => <div className="px-6 py-4">{row.dueDate}</div>,
//     },
//      {
//       id: 'actions',
//       label: 'Actions',
//       render: ({ row }) => (
//         <div className="flex justify-right mr-5-">
//            <CustomMenuButton
//                   icon={<FaEllipsisV />}
//                   items={getTaskMenuItems(row)}
//                   placement="bottom-left"
//                   className="text-gray-600"
//                   buttonClassName="hover:bg-gray-100 bg-transparent text-gray-600"
//                   menuClassName="min-w-[120px]"
//                   onSelect={(item) => item.onClick()}
//                 />
//         </div>
//       )
//     }
//     // {
//     //   id: "actions",
//     //   label: "Actions",
//     //   render: ({ row }) => {
//     //     if (!row) return null;

//     //     const canApproveOrReject = !["Approved", "Rejected"].includes(
//     //       row.status
//     //     );
//     //     return (
//     //       <div>
//     //         <div className="px-6 py-4 flex items-center space-x-2">
//     //           {canApproveOrReject && (
//     //             <CustomMenuButton
//     //               icon={<FaEllipsisV />}
//     //               items={getTaskMenuItems(row)}
//     //               placement="bottom-left"
//     //               buttonClassName="text-gray-600 hover:bg-gray-100 bg-transparent"
//     //               menuClassName="min-w-[140px]"
//     //             />
//     //             // <>
//     //             //   <CustomButtonp
//     //             //     label="Approve"
//     //             //     type="button"
//     //             //     disabled={row.status === "Approved"}
//     //             //     onClick={() => handleApprove(row)}
//     //             //     className="text-green-600 mr-2 hover:text-green-800 w-10 bg-green-500 hover:bg-green-600 text-white rounded"
//     //             //   />

//     //             //   <CustomButton
//     //             //     label="Reject"
//     //             //     type="button"
//     //             //     disabled={row.status === "Rejected"}
//     //             //     onClick={() => handleReject(row)}
//     //             //     className="text-red-600 hover:text-white-pure w-10 bg-red-500 hover:bg-red-300 text-white rounded"
//     //             //   />
//     //             // </>
//     //           )}

//   ];

//   // Filter tasks based on search and status
//   const filteredTasks = React.useMemo(() => {
//     return tasks.filter((task) => {
//       if (!task) return false;

//       const user = users.find((u) => u.id === task.userId);
//       const searchTerm = search.toLowerCase().trim();
//       const taskTitle = task.title?.toLowerCase() || "";
//       const userName = user?.name?.toLowerCase() || "";

//       const matchesSearch =
//         !searchTerm ||
//         taskTitle.includes(searchTerm) ||
//         userName.includes(searchTerm);

//       const matchesStatus = !statusFilter || task.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [tasks, users, search, statusFilter]);

//   if (loading) {
//     return <div className="p-6">Loading...</div>;
//   }

//   return (
//     <div className="p-6">
//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">
//             {selectedUserId
//               ? `Tasks for ${
//                   users.find((u) => u.id === Number(selectedUserId))?.name ||
//                   "User"
//                 }`
//               : "All Tasks"}
//           </h2>
//           {selectedUserId && (
//             <CustomButton
//               label="Show All Tasks"
//               onClick={() => {
//                 setSelectedUserId(null);
//                 navigate("/admin");
//               }}
//               className="bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2"
//             />
//           )}
//         </div>

//         <div className="mb-4 flex gap-4">
//           <SearchBox
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tasks..."
//           />
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="border rounded px-2 py-1"
//           >
//             <option value="">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Approved">Approved</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//         </div>

//         <Table
//           columns={columns}
//           data={filteredTasks}
//           emptyMessage="No tasks found"
//           className="w-full bg-white rounded-lg shadow overflow-hidden"
//           onSort={handleSort}
//           sortConfig={sortConfig}
//           itemsPerPage={5}
//         />
//       </div>
//       <CustomModal
//         isOpen={open}
//         onClose={() => {
//           setopen(false);
//           setSuccessMessage("");
//           setErrorMessage("");
//         }}
//         title={successMessage ? "Task Approved" : "Task Rejected"}
//         contentClass="p-4"
//         overlayClass="fixed inset-0 bg-black bg-opacity-50 blur-sm"
//       >
//         <div
//           className={`text-center ${
//             successMessage ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {successMessage || errorMessage}
//         </div>
//         <div className="flex justify-center mt-4">
//           <CustomButton
//             label="OK"
//             onClick={() => {
//               setopen(false);
//               setSuccessMessage("");
//               setErrorMessage("");
//             }}
//             className="bg-primarymain hover:bg-primarydark text-white px-8 py-2 rounded-md"
//           />
//         </div>
//       </CustomModal>
//       <CustomModal
//         isOpen={Boolean(deleteId)}
//         onClose={() => setDeleteId(null)}
//         title="Confirm Delete"
//         className="bg-white-pure text-white"
//         actions={
//           <>
//             <button
//               onClick={() => setDeleteId(null)}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleConfirmDelete}
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//             >
//               Delete
//             </button>
//           </>
//         }
//       >
//         <p className="mt-2 text-black">
//           Are you sure you want to delete this task?
//         </p>
//       </CustomModal>
//     </div>
//   );
// };

// export default AdminDashboard;
// src/pages/AdminDashboard/index.jsx
import React from "react";
import CustomButton from "../../shared/custombutton";
import CustomModal from "../../shared/custommodal";
import Table from "../../shared/table";
import CustomMenuButton from "../../shared/custommenu-button";
import SearchBox from "../../shared/SearchText";
import { FaEllipsisV } from "react-icons/fa";
import { useAdminDashboard } from "./use-admindashboard";

const AdminDashboard = () => {
  const {
    users,
    tasks,
    loading,
    search,
    handleSort,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedUserId,
    navigate,
    getTaskMenuItems,
    successMessage,
    errorMessage,
    open,
    setOpen,
    deleteId,
    sortConfig,
    setDeleteId,
    handleConfirmDelete,
  } = useAdminDashboard();

  const columns = [
    {
      id: "title",
      label: "Task",
      sortable: true,
      render: ({ row }) => <div className="px-6 py-4">{row.title}</div>,
    },
    {
      id: "user",
      label: "User",
      sortable: true,
      render: ({ row }) => {
        const user = users?.find((u) => u.id === row.userId);
        return <div className="px-6 py-4">{user?.name || "Unknown"}</div>;
      },
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: ({ row }) => (
        <div className="px-6 py-4">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {row.status}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      label: "Actions",

      render: ({ row }) => (
        <div className="px-6 py-4 flex justify-end">
          <CustomMenuButton
            icon={<FaEllipsisV />}
            items={getTaskMenuItems(row)}
            buttonClassName="text-gray-600"
            onSelect={(item) => item.onClick()}
          />
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {selectedUserId ? "User Tasks" : "All Tasks"}
        </h2>
        {selectedUserId && (
          <CustomButton
            label="Show All"
            onClick={() => navigate("/admin")}
            className="bg-gray-500 text-white"
          />
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <SearchBox value={search} onChange={(e) => setSearch(e.target.value)} />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={tasks}
        onSort={handleSort}
        sortConfig={sortConfig}
        itemsPerPage={5}
      />

      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={successMessage ? "Success" : "Error"}
      >
        <div className="text-center text-sm">
          {successMessage || errorMessage}
        </div>
      </CustomModal>

      <CustomModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
        className="bg-white-pure text-white"
        actions={
          <>
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="mt-2 text-black">
          Are you sure you want to delete this task?
        </p>
      </CustomModal>
    </div>
  );
};

export default AdminDashboard;
