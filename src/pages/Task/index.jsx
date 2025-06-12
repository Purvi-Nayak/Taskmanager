import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Table from '../../components/table';
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
  const columns = [
    {
      id: 'title',
      label: 'Title',
      field_name: 'title',
     
      render: ({ row }) => (
        <span className="font-semibold text-gray-900">{row.title}</span>
      )
    },
    {
      id: 'description',
      label: 'Description',
      field_name: 'description',
     
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      field_name: 'dueDate',
      render: ({ row }) => new Date(row.dueDate).toLocaleDateString()
    },
    {
      id: 'status',
      label: 'Status',
      field_name: 'status',
      render: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.status === 'Completed' ? 'bg-green-100 text-green-800' :
          row.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      render: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEdit(row)}
            className="text-primarymain hover:text-primary-700"
          >
            <FaEdit />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="text-status-error-dark hover:text-secondary-700"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];
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
      id: editingTask.id,
      userId: currentUser.id,
      updatedAt: new Date().toISOString()
    };

    setLoading(true);

    // Make sure you're passing the id correctly in the API call
    const response = await api.TASKS.update({
      data: updatedTask,
      taskId: editingTask.id  // Make sure this matches your API endpoint expectation
    });

    if (response.data) {
      // Update local state first
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask.id ? response.data : task
        )
      );

      // Close modal and clear editing state
      setIsModalOpen(false);
      dispatch(setEditingTask(null));
    }
  } catch (error) {
    console.error('Error updating task:', error);
    // Handle error (show error message to user)
  } finally {
    setLoading(false);
    // Refresh tasks after update
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
          label="New Task"
          onClick={handleOpenModal} // Use handleOpenModal here
          className=""
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
        <Table 
          columns={columns}
          data={tasks}
          emptyMessage="No tasks found"
        

        />
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
            status: '',
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