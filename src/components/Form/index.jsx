import React from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, setModalOpen } from '../../redux/slices/taskSlice';
import { taskValidation } from '../../utils/validation';
import InputText from '../../shared/InputText';
import CustomButton from '../../shared/Button';
import { api } from '../../api/client';
import { useState } from 'react';

const TaskForm = ({ initialValues, onSubmit }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.users.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => {
    setIsModalOpen(false);
    dispatch(setModalOpen(false));
  };


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.TASKS.create({
        data: {
          ...values,
          userId: currentUser.id,
        }
      });
      console.log('Creating task with values:', response)
      console.log('Task created:', response.data);
      if (response.data) {
        dispatch(addTask(response.data));
        dispatch(setModalOpen(false));
        onSubmit(); // Call the onSubmit prop to refresh the task list
        setIsModalOpen(false); // Close the modal
        //close modal see data in table 

  
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setSubmitting(false);
    }
  };
const handleupdate = async (values, { setSubmitting }) => {
    try {
      const response = await api.TASKS.update({
        data: {
          ...values,
          userId: currentUser.id,
        }
      });
      console.log('Updating task with values:', response)
      console.log('Task updated:', response.data);
      if (response.data) {
        dispatch(updateTask(response.data));
        dispatch(setModalOpen(false));
        onSubmit(); // Call the onSubmit prop to refresh the task list
        setIsModalOpen(false); // Close the modal
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg">
      <Formik
        initialValues={initialValues}
        validationSchema={taskValidation}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form className="space-y-4">
            <InputText
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title && errors.title}
              placeholder="Enter task title"
            />

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 border rounded"
                rows="4"
                placeholder="Enter task description"
              />
              {touched.description && errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <InputText
              label="Due Date"
              name="dueDate"
              type="date"
              value={values.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dueDate && errors.dueDate}
            />
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded focus:outline-none transition-colors ${
                  touched.status && errors.status
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="">Select status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {touched.status && errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <CustomButton
                text="Cancel"
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600"
              />
              <CustomButton
                text={initialValues.id ? "Update Task" : "Create Task"}
                type="submit"
               onClick={initialValues.id ? handleupdate : handleSubmit}
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaskForm;