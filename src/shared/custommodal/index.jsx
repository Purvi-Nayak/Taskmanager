// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteTask } from "../../redux/slices/taskSlice";
// import { api } from "../../api/client";

// const CustomModal = ({
//   isOpen,
//   onClose,
//   title,
//   content,
//   children,
//   onConfirm,
//   onCancel,
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   taskId, // Add this prop
// }) => {
//   if (!isOpen) return null;

//   const dispatch = useDispatch();
//   const currentUser = useSelector((state) => state.users.user); // Changed from currentUser

// const handleConfirmDelete = async () => {
//   try {
//     await api.TASKS.delete({ id: deleteId });
//     // Update local state
//     setTasks(tasks.filter(task => task.id !== deleteId));
//     // Close the modal
//     setDeleteId(null);
//     // Refresh the tasks
//     await fetchTasks();
//   } catch (error) {
//     console.error("Error deleting task:", error);
//   }
// };

//   // If content is provided, show confirmation dialog
//   if (content) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white-pure rounded-lg p-6 max-w-md w-full mx-4">
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold">{title}</h2>
//             <p className="mt-2 text-gray-600">{content}</p>
//           </div>
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={onCancel}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//             >
//               {cancelText}
//             </button>
//             <button
//               onClick={onConfirm}
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//             >
//               {confirmText}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Otherwise show regular modal with children
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-xl"
//           >
//             ×
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default CustomModal;
import React from "react";

const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  showCloseIcon = true,
  titleClass = "",
  contentClass = "",
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white-pure rounded-lg shadow-lg max-w-lg w-full mx-4 ${contentClass}`}
        {...props}
      >
        {title && (
          <div
            className={`flex items-center justify-between px-6 py-4 border-b border-table-border ${titleClass}`}
          >
            <h2 className="text-xl font-semibold text-primarymain">{title}</h2>
            {showCloseIcon && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
                aria-label="close"
              >
                &times;
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-4">{children}</div>

        {actions && (
          <div className="flex justify-end gap-2 px-6 py-3 border-t border-table-border">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModal;
