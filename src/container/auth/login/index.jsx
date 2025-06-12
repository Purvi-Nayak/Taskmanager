import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { data, useNavigate } from "react-router-dom";
import { setUser, setToken, setError } from "../../../redux/slices/userSlice";
import { api } from "../../../api/client";
import InputText from "../../../shared/InputText";
import CustomButton from "../../../shared/Button";
import { loginValidation } from "../../../utils/validation";
import { Link } from "react-router-dom";
import CustomModal from "../../../components/Modal";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);

  // const handleSubmit = async (values, { setSubmitting }) => {
  //   try {
  //     const response = await api.USERS.login({
  //       data: {
  //         email: values.email,
  //         password: values.password,
  //       },
  //     });
  //     console.log("Login response:", response.data);
  //     const { user, token } = response.data;
  //     if (!user) {
  //       dispatch(setError("Invalid credentials"));
  //       setAlertOpen(true);
  //       return;
  //     }
  //     // Store user and token in Redux
  //     dispatch(setUser(user));
  //     dispatch(setToken(token));

  //     // Redirect based on role
  //     navigate(user.role === "admin" ? "/admin" : "/");
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     const message =
  //       error.response?.data?.message || "An error occurred during login";
  //     dispatch(setError(message));
  //     setAlertOpen(true);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
// const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       console.log("Login form values:", values);
//         const response = await api.USERS.login({
//             data: {
//                 email: values.email,
//                 password: values.password,
//             },
//         });
//         console.log("Login request data:", {
//             email: values.email,
//             password: values.password,
//         });
// console.log("Login response:", response.data);
//         const { user, token } = response.data;

//         if (!user) {
//             dispatch(setError("Invalid credentials"));
//             setAlertOpen(true);
//             return;
//         }

//         // Store user and token in Redux
//         dispatch(setUser(user));
//         dispatch(setToken(token));
//         dispatch(setError(null)); // Clear any previous errors

//         // Redirect based on role
//         navigate(user.role === "admin" ? "/admin" : "/");
        
//     } catch (error) {
//         console.error("Login error:", error);
//         const message = error.response?.data?.message || "User not found. Please register first.";
//         dispatch(setError(message));
//         setAlertOpen(true);
//     } finally {
//         setSubmitting(false);
//     }
// };
const handleSubmit = async (values, { setSubmitting }) => {
    try {
        const response = await api.USERS.login({
            data: {
                email: values.email,
                password: values.password
            }
        });
console.log("Login request data:", {
            email: values.email,
            password: values.password,
        });
        console.log("Login response:", response.data);
        const users = response.data;

        if (!users || users.length === 0) {
            dispatch(setError("Invalid credentials"));
            setAlertOpen(true);
            return;
        }

        const user = users[0]; // Get first matching user

        // Generate token
        const token = btoa(JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role
        }));

        // Store in Redux
        dispatch(setUser(user));
        dispatch(setToken(token));
        dispatch(setError(null));

        // Redirect based on role
        navigate(user.role === "admin" ? "/admin" : "/");

    } catch (error) {
        console.error("Login error:", error);
        dispatch(setError("Invalid email or password"));
        setAlertOpen(true);
    } finally {
        setSubmitting(false);
    }
};
  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={loginValidation}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link
                      to="/forgotpassword"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <CustomButton
                  text="Login"
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                />
              </Form>
            )}
          </Formik>
          <div className="mt-4 text-center">
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
      <CustomModal
        open={alertOpen}
        title="Login Failed"
        message="User not found. Please register first."
        onConfirm={() => setAlertOpen(false)}
        confirmText="OK"
        showCancel={false}
      />
    </>
  );
};

export default Login;
