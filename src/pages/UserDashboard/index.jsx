// import React from 'react';
// import { useSelector } from 'react-redux';

// const UserDashboard = () => {
//   const usersList = useSelector(state => state.users.usersList);
//   const currentUser = useSelector(state => state.users.user);
//   const tasks = useSelector(state => state.tasks.tasks);

//   // Total users
//   const totalUsers = usersList.length;

//   // Total tasks for the logged-in user
//   const userTasks = tasks.filter(task => task.userId === currentUser?.id);
//   const totalUserTasks = userTasks.length;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-blue-300 rounded-md shadow p-6 flex flex-col items-center">
//           <span className="text-gray-500 text-lg mb-2">Total Users</span>
//           <span className="text-4xl font-bold text-blue-600">{totalUsers}</span>
//         </div>
//         <div className="bg-blue-300 rounded-lg shadow p-6 flex flex-col items-center">
//           <span className="text-gray-500 text-lg mb-2">Your Total Login user's Tasks</span>
//           <span className="text-4xl font-bold text-blue-600">{totalUserTasks}</span>
//         </div>
//       </div>
  
//        <div className="mt-10">
//   <p className="text-gray-700">
//     {currentUser?.role === 'admin' ? 'Welcome to your Admin dashboard!' : 'Welcome to your User dashboard!'}
//   </p>

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserDashboard = () => {
  const usersList = useSelector(state => state.users.usersList);
  const currentUser = useSelector(state => state.users.user);
  const tasks = useSelector(state => state.tasks.tasks);
  const [taskStats, setTaskStats] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
    inProgress: 0
  });

  useEffect(() => {
    // Calculate task statistics
    const stats = tasks.reduce((acc, task) => {
      if (task.userId === currentUser?.id) {
        switch (task.status) {
          case 'Approved':
            acc.approved++;
            break;
          case 'Rejected':
            acc.rejected++;
            break;
          case 'Pending':
            acc.pending++;
            break;
          case 'In Progress':
            acc.inProgress++;
            break;
          default:
            break;
        }
      }
      return acc;
    }, {
      approved: 0,
      rejected: 0,
      pending: 0,
      inProgress: 0
    });

    setTaskStats(stats);
  }, [tasks, currentUser]);

  // Bar Chart Data
  const barChartData = {
    labels: ['Approved', 'Rejected', 'Pending', 'In Progress'],
    datasets: [
      {
        label: 'Task Status Distribution',
        data: [
          taskStats.approved,
          taskStats.rejected,
          taskStats.pending,
          taskStats.inProgress
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Status Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Calculate user role distribution for pie chart with null checks
  const userRoleDistribution = usersList?.reduce((acc, user) => {
    if (user && user.role) {
      acc[user.role] = (acc[user.role] || 0) + 1;
    }
    return acc;
  }, {}) || {};

  // Add fallback for empty data
  const pieChartData = {
    labels: Object.keys(userRoleDistribution).length > 0 
      ? Object.keys(userRoleDistribution) 
      : ['No Data'],
    datasets: [
      {
        data: Object.keys(userRoleDistribution).length > 0 
          ? Object.values(userRoleDistribution)
          : [1],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Role Distribution',
      },
    }
  };

  // Update the stats card to handle null usersList
  const totalUsers = usersList?.length || 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-green-100 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Approved Tasks</h3>
          <p className="text-3xl font-bold text-green-600">{taskStats.approved}</p>
        </div>
        <div className="bg-red-100 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Rejected Tasks</h3>
          <p className="text-3xl font-bold text-red-600">{taskStats.rejected}</p>
        </div>
        <div className="bg-yellow-100 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold text-yellow-600">{taskStats.pending}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-sm shadow p-6">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        <div className="bg-white rounded-sm shadow p-6">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-8">
        <p className="text-gray-700 text-lg">
          {currentUser?.role === 'admin' 
            ? 'Welcome to your Admin dashboard!' 
            : 'Welcome to your User dashboard!'}
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;