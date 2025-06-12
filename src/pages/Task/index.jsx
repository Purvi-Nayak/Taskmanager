// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
// import { deleteTask, setModalOpen, setEditingTask } from '../../redux/slices/taskSlice';
// import TaskForm from '../../components/Form';
// import CustomButton from '../../components/Button';
// import CustomModal from '../../components/Modal';
// import useDebounce from '../../hooks/useDebounce';
// import SearchBox from '../../components/SearchText';

// const Tasks = () => {
//   const dispatch = useDispatch();
//   const { tasks, isModalOpen, editingTask } = useSelector(state => state.tasks);
//   const currentUser = useSelector(state => state.users.user);
//   const userToken = useSelector(state => state.users.token);

//   // Filter tasks by user token
//   const userTasks = tasks.filter(task => task.userToken === userToken);

//   // State for delete modal
//   const [deleteId, setDeleteId] = useState(null);
//   const [search, setSearch] = useState('');
//   const debouncedSearch = useDebounce(search, 400);

//   // Filter tasks by debounced search
//   const filteredTasks = userTasks.filter(task =>
//     task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//     task.description.toLowerCase().includes(debouncedSearch.toLowerCase())
//   );

//   const handleEdit = (task) => {
//     if (task.userToken === userToken) {
//       dispatch(setEditingTask(task));
//       dispatch(setModalOpen(true));
//     }
//   };

//   const handleDelete = (taskId) => {
//     setDeleteId(taskId);
//   };

//   const confirmDelete = () => {
//     dispatch(deleteTask({ taskId: deleteId, userToken }));
//     setDeleteId(null);
//   };

//   const cancelDelete = () => {
//     setDeleteId(null);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
//         <CustomButton
//           text="New Task"
//           onClick={() => {
//             dispatch(setEditingTask(null));
//             dispatch(setModalOpen(true));
//           }}
//           className="flex items-center gap-2"
//           icon={<FaPlus />}
//         />
//       </div>

//       {/* Add search box */}
//       <div className="mb-4 max-w-xs">
//         <SearchBox
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="Search tasks..."
//         />
//       </div>

//       {/* Task Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Description
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Due Date
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredTasks.map((task) => (
//               <tr key={task.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {task.title}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="text-sm text-gray-500 line-clamp-2">
//                     {task.description}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                     task.status === 'Completed' ? 'bg-green-100 text-green-800' :
//                     task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {task.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(task.dueDate).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => handleEdit(task)}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(task.id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Confirm Delete Modal */}
//       <CustomModal
//         open={!!deleteId}
//         title="Delete Task"
//         message="Are you sure you want to delete this task?"
//         onConfirm={confirmDelete}
//         onCancel={cancelDelete}
//         confirmText="Delete"
//         cancelText="Cancel"
//         showCancel={true}
//       />

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="max-w-2xl w-full mx-4">
//             <TaskForm 
//               initialValues={editingTask} 
//               isEditing={!!editingTask}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tasks;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Table, { TableRow, TableCell } from '../../components/table';
import { 
  addTask, 
  updateTask, 
  deleteTask, 
  setModalOpen, 
  setEditingTask,
  setLoading,
  setError 
} from '../../redux/slices/taskSlice';
import { api } from '../../api/client';
import TaskForm from '../../components/Form';
import CustomButton from '../../shared/Button';
import CustomModal from '../../components/Modal';
import useDebounce from '../../hooks/useDebounce';
import SearchBox from '../../shared/SearchText';

const Tasks = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.users.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add this state
  const editingTask = useSelector(state => state.tasks.editingTask);
  const debouncedSearch = useDebounce(search, 400);
const headers = ['Title', 'Description', 'Date','Status', 'Actions'];
  // Add these handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
    dispatch(setEditingTask(null));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setEditingTask(null));
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.TASKS.getUserTasks({
        userId: currentUser.id
    
      });
      console.log("Fetch tasks response:", response.data);
      console.log("Fetch tasks request data:", response)
      if (response.data) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Current user:", currentUser);
  console.log("Tasks:", tasks);
useEffect(() => {
  if (!isModalOpen) {
    fetchTasks(); // Refresh tasks when modal closes
  }
}, [isModalOpen]);
  // Search tasks
  useEffect(() => {
    const searchTasks = async () => {
      if (debouncedSearch) {
        try {
          setLoading(true);
          const response = await api.TASKS.searchByTitle({ 
            data: debouncedSearch 
          });
          if (response.data) {
            setTasks(response.data);
          }
        } catch (error) {
          console.error('Error searching tasks:', error);
        } finally {
          setLoading(false);
        }
      } else {
        fetchTasks();
      }
    };
    searchTasks();
  }, [debouncedSearch, currentUser.id]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [currentUser.id]);

const handleEdit = async (task) => {
  try {
    // No need to make an API call here - we just want to open the modal with task data
    dispatch(setEditingTask(task));
    setIsModalOpen(true);
  } catch (error) {
    console.error('Error setting up edit:', error);
    dispatch(setError(error.message));
  }
};
const handleUpdateTask = async (taskData) => {
  try {
    // First, ensure we have all required data
    const updatedTask = {
      ...taskData,
      userId: currentUser.id,
      updatedAt: new Date().toISOString(),
      id: editingTask.id // Make sure we have the task ID
    };

    // Dispatch loading state
    setLoading(true);

    // Make the API call
    const response = await api.TASKS.update({ 
      id: editingTask.id,
      data: updatedTask
    });
console.log('Update task response:', response.data);
    console.log("Update task request data:", response)
    if (response.data) {
      // Update Redux store
      dispatch(updateTask(response.data));
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask.id ? response.data : task
        )
      );

      // Close modal and clear editing state
      setIsModalOpen(false);
      dispatch(setEditingTask(null));

      // Show success message (if you have a notification system)
      console.log('Task updated successfully');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    // Handle error (show error message to user)
    dispatch(setError(error.message || 'Failed to update task'));
  } finally {
    setLoading(false);
    // Refresh the tasks list to ensure we have the latest data
    await fetchTasks();
  }
};
  const handleDelete = (taskId) => {
    setDeleteId(taskId);
  };
const handleConfirmDelete = async () => {
  try {
    await api.TASKS.delete({ id: deleteId });
    // Update local state
    setTasks(tasks.filter(task => task.id !== deleteId));
    // Close the modal
    setDeleteId(null);
    // Refresh the tasks
    await fetchTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
  // const confirmDelete = async () => {
  //   try {
  //     await api.TASKS.delete({ id: deleteId });
  //     dispatch(deleteTask({ taskId: deleteId, userId: currentUser.id }));
  //     setDeleteId(null);
  //   } catch (error) {
  //     dispatch(setError(error.message));
  //     console.error('Error deleting task:', error);
  //   }
  // };

  // const handleAddTask = async (taskData) => {
  //   try {
  //     const response = await api.TASKS.create({ 
  //       data: {
  //         ...taskData,
  //         userId: currentUser.id,
  //         createdAt: new Date().toISOString()
  //       }
  //     });
  //     console.log('Add task response:', response.data);
  //     console.log("Add task request data:", response)
  //     if (response.data) {
  //       dispatch(addTask({
  //         ...response.data,
  //         userId: currentUser.id
  //       }));
  //       dispatch(setModalOpen(false));
  //     }
  //   } catch (error) {
  //     dispatch(setError(error.message));
  //     console.error('Error adding task:', error);
  //   }
  // };

// const handleAddTask = async (taskData) => {
//   try {
//     const response = await api.TASKS.create({ 
//       data: {
//         ...taskData,
//         userId: currentUser.id,
//         createdAt: new Date().toISOString()
//       }
//     });
    
//     if (response.data) {
//       dispatch(addTask({
//         ...response.data,
//         userId: currentUser.id
//       }));
//       setIsModalOpen(false);
//       // Add this line to refresh the tasks list
//       await fetchTasks();
//     }
//   } catch (error) {
//     dispatch(setError(error.message));
//     console.error('Error adding task:', error);
//   }
// };
const handleAddTask = async (taskData) => {
  try {
    const newTask = {
      ...taskData,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: taskData.status,
      dueDate: new Date(taskData.dueDate).toISOString()
    };

    const response = await api.TASKS.getUserTasks({ 
      data: newTask
    });
    
    if (response.data) {
      dispatch(addTask(response.data));
      setIsModalOpen(false);
      fetchTasks(); // Refresh the task list
    }
  } catch (error) {
    console.error('Error adding task:', error);
  }
};
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
        <CustomButton
          text="New Task"
          onClick={handleOpenModal} // Use handleOpenModal here
          className="flex items-center gap-2"
          icon={<FaPlus />}
        />
      </div>

      <div className="mb-4 max-w-xs">
        <SearchBox
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks..."
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table headers={headers}>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(task)}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="text-secondary-500 hover:text-secondary-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
<CustomModal
  isOpen={Boolean(deleteId)}
  onClose={() => setDeleteId(null)}
  title="Confirm Delete"
  content="Are you sure you want to delete this task?"
  taskId={deleteId}
  onConfirm={handleConfirmDelete} // Add this line
  onCancel={() => setDeleteId(null)}
  confirmText="Delete"
  cancelText="Cancel"
/>
      {/* <CustomModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
        content="Are you sure you want to delete this task?"
   
        onCancel={() => setDeleteId(null)}
   
      /> */}

      {/* Add/Edit Task Modal */}
     <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Add Task"}
      >
        <TaskForm
          initialValues={editingTask || {
            title: '',
            description: '',
            status: 'Pending',
            dueDate: new Date().toISOString().split('T')[0]
          }}
          onSubmit={async (values) => {
            if (editingTask) {
              await handleUpdateTask(values);
            } else {
              await handleAddTask(values);
            }
            handleCloseModal();
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Tasks;