// const Tasks = () => {
//   // ... existing state and other code ...

//   const columns = [
//     {
//       id: "title",
//       label: "Task",
//       field_name: "title",
//       render: ({ row }) => (
//         <div className="px-6 py-4">{row.title}</div>
//       )
//     },
//     {
//       id: "status",
//       label: "Status",
//       field_name: "status",
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
//       )
//     },
//     // ... other columns ...
//   ];

//   // Modify fetchTasks to get user-specific tasks
//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const response = await api.TASKS.getUserTasks({
//         userId: currentUser.id
//       });
      
//       if (response.data) {
//         setTasks(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUser.id]);
const handleApprove = async (task) => {
  try {
    const response = await api.TASKS.updateStatus({
      id: task.id,
      status: "Approved"
    });
    
    if (response.data) {
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === task.id ? response.data : t)
      );
      dispatch(updateTask(response.data));
      // Refresh data to ensure consistency
      fetchData();
    }
  } catch (error) {
    console.error("Error approving task:", error);
  }
};

const handleReject = async (task) => {
  try {
    const response = await api.TASKS.updateStatus({
      id: task.id,
      status: "Rejected"
    });
    
    if (response.data) {
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === task.id ? response.data : t)
      );
      dispatch(updateTask(response.data));
      fetchData();
    }
  } catch (error) {
    console.error("Error rejecting task:", error);
  }
};