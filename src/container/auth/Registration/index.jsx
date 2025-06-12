// import React, { useState } from 'react';
// import axios from 'axios';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post('http://localhost:3001/api/auth/register', {
//       username: formData.username,
//       email: formData.email,
//       password: formData.password,
//       created_at: new Date().toISOString()
//     });
//     console.log('Registration successful:', response.data);

//   } catch (error) {
//     console.error('Registration failed:', error.response?.data || error.message);

//   }
// };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Please fill in the information below
//           </p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                 Username
//               </label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 value={formData.username}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 required
//                 className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Register
//             </button>
//           </div>
//         </form>

//         <p className="mt-2 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link
//             to="/"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React from "react";
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setUser,
  setToken,
  addToUsersList,
} from "../../../redux/slices/userSlice"; // Add addToUsersList
import { api } from "../../../api/client";
import InputText from "../../../shared/InputText";
import CustomButton from "../../../shared/Button";
import { registerValidation } from "../../../utils/validation";
import { Link } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  };

  // const handleSubmit = async (values, { setSubmitting }) => {
  //   try {
  //     const response = await api.USERS.register({
  //       data: {
  //         email: values.email,
  //         name: values.name,
  //         password: values.password,
  //         role: values.role,
  //       },
  //     });
  //     console.log('response: ', response.data);
  //     return;
  //     if (data) {
  //       // Add user to Redux store
  //       dispatch(addToUsersList(data));

  //       // Generate token
  //       const token = btoa(
  //         JSON.stringify({
  //           id: data.id,
  //           email: data.email,
  //           role: data.role,
  //         })
  //       );

  //       // Update Redux state
  //       dispatch(setToken(token));
  //       dispatch(setUser(data));

  //       // Navigate to appropriate dashboard
  //       navigate(data.role === "admin" ? "/admin" : "/");
  //     }
  //   } catch (error) {
  //     console.error("Registration error:", error);
  //     alert("Registration failed: " + error.message);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
const handleSubmit = async (values, { setSubmitting }) => {
    try {
        // Check if user exists
        const checkUser = await api.USERS.login({
            data: { email: values.email }
        });

        if (checkUser.data.length > 0) {
            alert("User with this email already exists");
            return;
        }

        // Register new user
        const response = await api.USERS.register({
            data: {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role,
                createdAt: new Date().toISOString()
            }
        });
        console.log("Registration response:", response.data);
        if (!response.data) {
            throw new Error("Registration failed. Please try again.");
        }
        console.log("New user data:", response);

        const newUser = response.data;

        // Generate token
        const token = btoa(JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        }));

        // Update Redux store
        dispatch(addToUsersList(newUser));
        dispatch(setUser(newUser));
        dispatch(setToken(token));

        // Redirect
        navigate(newUser.role === "admin" ? "/admin" : "/");

    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + error.message);
    } finally {
        setSubmitting(false);
    }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-6">Create Account</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={registerValidation}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form className="space-y-4">
              <InputText
                label="Username"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
                placeholder="Enter your username"
              />

              <InputText
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                placeholder="Enter your email"
              />

              <InputText
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                placeholder="Enter your password"
              />

              <InputText
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                placeholder="Confirm your password"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={values.role === "user"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">User</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={values.role === "admin"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Admin</span>
                  </label>
                </div>
                {touched.role && errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>

              <CustomButton
                text="Register"
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              />
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
