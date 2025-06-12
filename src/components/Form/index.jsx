
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, setModalOpen } from '../../redux/slices/taskSlice';
import { taskValidation } from '../../utils/validation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGroup from '../../shared/FormGroup';
import CustomButton from '../../shared/Button';
import { api } from '../../api/client';
import { useState } from 'react';

const TaskForm = ({ initialValues,onSubmit: onSubmitProp}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.users.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(taskValidation),
    defaultValues: initialValues
  });

 const onSubmit = async (values) => {
    try {
      const taskData = {
        ...values,
        userId: currentUser.id,
      };

      const response = initialValues.id 
        ? await api.TASKS.update({ data: taskData })
        : await api.TASKS.create({ data: taskData });

      if (response.data) {
        if (initialValues.id) {
          dispatch(updateTask(response.data));
        } else {
          dispatch(addTask(response.data));
        }
        dispatch(setModalOpen(false));
        onSubmitProp(); // Refresh task list
      }
    } catch (error) {
      console.error('Error handling task:', error);
    }
  };

  const onClose = () => {
    dispatch(setModalOpen(false));
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
        onSubmit(); 
        setIsModalOpen(false); 
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
<div className="bg-white-pure p-6 rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormGroup
          label="Title"
          name="title"
          register={register}
          error={errors.title}
          placeholder="Enter task title"
        />

        <div className="space-y-2">
          <label className="block font-roboto text-input-label font-medium text-black">
            Description
          </label>
          <textarea
            {...register('description')}
            className={`w-full px-4 py-2 rounded-md border font-roboto
              ${errors.description ? 'border-status-error-main' : 'border-neutral-main'}
              focus:outline-none focus:border-primarymain`}
            rows="4"
            placeholder="Enter task description"
          />
          {errors.description && (
            <p className="text-sm text-status-error-main font-roboto">
              {errors.description.message}
            </p>
          )}
        </div>

        <FormGroup
          label="Due Date"
          name="dueDate"
          type="date"
          register={register}
          error={errors.dueDate}
        />

        <div className="space-y-2">
          <label className="block font-roboto text-input-label font-medium text-black">
            Status
          </label>
          <select
            {...register('status')}
            className={`w-full px-4 py-2 rounded-md border font-roboto
              ${errors.status ? 'border-status-error-main' : 'border-neutral-main'}
              focus:outline-none focus:border-primarymain`}
          >
            <option value="">Select status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && (
            <p className="text-sm text-status-error-main font-roboto">
              {errors.status.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <CustomButton
            label="Cancel"
            type="button"
            onClick={onClose}
            className="bg-neutral-main hover:bg-neutral-dark"
          />
          <CustomButton
            label={initialValues.id ? "Update Task" : "Create Task"}
            type="submit"
            disabled={isSubmitting}
            className="bg-primarymain hover:bg-primarydark"
          />
        </div>
      </form>
    </div>
  );
};

export default TaskForm;