import client from ".";
import { METHODS } from "../constant";

export const api = {
    // USERS: {
    //   login: ({ data, ...config }) => client({ method: METHODS.POST, url: '/users', data, ...config }), // Changed from /users/login
    //     register: ({ data, ...config }) => client({ method: METHODS.POST, url: '/users', data, ...config }), // Changed from /users/register
    //      getUserByEmail: ({ data, ...config }) => 
    //   client({ 
    //     method: METHODS.GET, 
    //     url: `/users?email=${encodeURIComponent(data.email)}`, 
    //     ...config 
    //   }),
    //  getAll: (config = {}) => 
    //   client({ 
    //     method: METHODS.GET, 
    //     url: '/users', 
    //     ...config 
    //   }),
    //     post: ({ data, ...config }) => client({ method: METHODS.POST, url: '/users', data, ...config }),
    //     searchByName: ({ data, ...config }) => client({ method: METHODS.GET, url: `/users?name_like=${data}`, data, ...config }),
    // },
  
    USERS: {
        register: ({data,...config}) => client({ method: METHODS.POST, url: '/users', data, ...config }),
                login: ({data,...config}) => 
            client({ method: METHODS.GET, url: `/users?email=${data.email}&password=${data.password}`, ...config }),
        getAll: () =>  client({ 
        method: METHODS.GET, 
        url: '/users', 
        ...config 
      }),
        getUserByEmail: (data,...config) => client({ 
        method: METHODS.GET, 
        url: `/users?email=${encodeURIComponent(data.email)}`, 
        ...config 
      }),
        update: (id, data) => client.put(`/users/${id}`, data),
        delete: (id) => client.delete(`/users/${id}`)
    },
    // TASKS: {
    //     getAll: ({ data, ...config }) => client({ method: METHODS.GET, url: '/tasks', data, ...config }),
    //     get: ({ id, data, ...config }) => client({ method: METHODS.GET, url: `/tasks/${id}`, data, ...config }),
    //     post: ({ data, ...config }) => client({ method: METHODS.POST, url: '/tasks', data, ...config }),
    //     update: ({ id, data, ...config }) => client({ method: METHODS.PATCH, url: `/tasks/${id}`, data, ...config }),
    //     delete: ({ id, data, ...config }) => client({ method: METHODS.DELETE, url: `/tasks/${id}`, data, ...config }),
    //     searchByName: ({ data, ...config }) => client({ method: METHODS.GET, url: `/tasks?userName_like=${data}`, data, ...config }),
    //     searchByTitle: ({ data, ...config }) => client({ method: METHODS.GET, url: `/tasks?title_like=${data}`, data, ...config }),
    //     sortAndFilter: ({ data, ...config }) => client({ method: METHODS.GET, url: `/tasks?_sort=${data.sortTask}&${data.filterQuery}`, data, ...config }),
    // }
     TASKS: {
        // User specific tasks
        getUserTasks: ({userId, ...config}) => client({ 
            method: METHODS.GET, 
            url: `/tasks?userId=${userId}`, 
            ...config ,
      
        }),
        get:({
            id, ...config
        }
        )=> client({ 
            method: METHODS.GET, 
            url: `/tasks/${id}`, 
            ...config   

        }),
        // Create task
        create: ({data, ...config}) => client({ 
            method: METHODS.POST, 
            url: '/tasks', 
            data: {
                ...data,
                createdAt: new Date().toISOString(),
             
            }, 
            ...config 
        }),
        // Admin actions
        updateStatus: ({id, status, ...config}) => client({ 
            method: METHODS.PUT, 
            url: `/tasks/${id}`, 
            data: { status }, 
            ...config 
        }),
        // General actions
      delete: ({id}) => client({ 
        method: METHODS.DELETE, 
        url: `/tasks/${id}`
    }),

    update: ({ data, taskId }) => 
        client({
            method: METHODS.PUT, 
            url: `/tasks/${taskId}`, 
            data: {
                ...data,
                updatedAt: new Date().toISOString(),
            }
        }),


        // Search and filter
        search: ({query, userId, ...config}) => client({ 
            method: METHODS.GET, 
            url: `/tasks?userId=${userId}&title_like=${query}`, 
            ...config 
        }),

    }
}