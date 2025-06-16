import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, setToken, setError } from "../../../redux/slices/userSlice";
import { api } from "../../../api/client";
import CustomButton from "../../../shared/custombutton";
import { loginValidation } from "../../../utils/validation";
import { Link } from "react-router-dom";
import CustomModal from "../../../shared/custommodal";
import FormGroup from "../../../shared/formgroup";
import Checkbox from "../../../shared/checkbox";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);

const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await api.USERS.login({
        data: {
          email: values.email,
          password: values.password,
        },
      });
console.log("Login response:", response);
      const users = response.data;

      if (!users || users.length === 0) {
        dispatch(setError("Invalid credentials"));
        setAlertOpen(true);
        return;
      }

      const user = users[0];
      const token = btoa(
        JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
        })
      );

      dispatch(setUser(user));
      dispatch(setToken(token));
      dispatch(setError(null));

      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Login error:", error);
      dispatch(setError("Invalid email or password"));
      setAlertOpen(true);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-center text-2xl font-bold mb-6">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormGroup
              label="Email"
              name="email"
              register={register}
              error={errors.email}
              placeholder="Enter your email"
            />
            <FormGroup
              label="Password"
              name="password"
              register={register}
              error={errors.password}
              type="password"
              placeholder="Enter your password"
            />

            {/* Need to proper change */}
            <div className="flex items-center justify-between">
 <Checkbox
  label="Remember me"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>
       
              <Link
                to="/forgotpassword"
                className="text-sm font-medium text-primarymain hover:text-primarydark"
              >
                Forgot password?
              </Link>
            </div>

            <CustomButton
              label="Login"
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            />
          </form>
          <div className="mt-1 text-center">
            <Link
              to="/register"
              className="text-sm text-primarymain hover:text-primarydark"
            >
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>

      <CustomModal
        open={alertOpen}
        title="Login Failed"
        message="Invalid credentials. Please try again."
        onConfirm={() => setAlertOpen(false)}
        confirmText="OK"
        showCancel={false}
      />
    </>
  );
};

export default Login;
