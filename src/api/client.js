import client from ".";
import { METHODS } from "../constant";

export const api = {
  USERS: {
    register: ({ data, ...config }) =>
      client({ method: METHODS.POST, url: "/users", data, ...config }),
    login: ({ data, ...config }) =>
      client({
        method: METHODS.GET,
        url: `/users?email=${data.email}&password=${data.password}`,
        ...config,
      }),
    getAll: (config) =>
      client({
        method: METHODS.GET,
        url: "/users",
        ...config,
      }),
    getUserByEmail: (data, ...config) =>
      client({
        method: METHODS.GET,
        url: `/users?email=${encodeURIComponent(data.email)}`,
        ...config,
      }),
    update: (id, data) => client.put(`/users/${id}`, data),
    delete: (id) => client.delete(`/users/${id}`),
  },
  TASKS: {
    getUserTasks: ({ userId, ...config }) =>
      client({
        method: METHODS.GET,
        url: `/tasks?userId=${userId}`,
        ...config,
      }),
    get: ({ id, ...config }) =>
      client({
        method: METHODS.GET,
        url: `/tasks/${id}`,
        ...config,
      }),
    // Create task
    create: ({ data, ...config }) =>
      client({
        method: METHODS.POST,
        url: "/tasks",
        data: {
          ...data,
          createdAt: new Date().toISOString(),
        },
        ...config,
      }),
    // Admin actions
    updateStatus: ({ taskId, data }) =>
      client({
        method: "PUT",
        url: `/tasks/${taskId}`,
        data
      }),
    // General actions
    delete: ({ id }) =>
      client({
        method: METHODS.DELETE,
        url: `/tasks/${id}`,
      }),

    update: ({ data, taskId }) =>
      client({
        method: METHODS.PUT,
        url: `/tasks/${taskId}`,
      data
      }),
    getAllTasks: () =>
      client({
        url: "/tasks",
      }),

    // Search and filter
    search: ({ query, userId, ...config }) =>
      client({
        method: METHODS.GET,
        url: `/tasks?userId=${userId}&title_like=${query}`,
        ...config,
      }),
  },
};
