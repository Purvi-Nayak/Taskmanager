import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  setUser,
  setToken,
  addToUsersList,
} from "../../../redux/slices/userSlice";
import { api } from "../../../api/client";
import FormGroup from "../../../shared/formgroup";
import CustomButton from "../../../shared/custombutton";
import { registerValidation } from "../../../utils/validation";

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const onSubmit = async (values) => {
    try {
      const checkUser = await api.USERS.login({
        data: { email: values.email },
      });

      if (checkUser.data.length > 0) {
        alert("User with this email already exists");
        return;
      }

      const response = await api.USERS.register({
        data: {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          createdAt: new Date().toISOString(),
        },
      });

      const newUser = response.data;
      const token = btoa(
        JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        })
      );

      dispatch(addToUsersList(newUser));
      dispatch(setUser(newUser));
      dispatch(setToken(token));

      navigate(newUser.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormGroup
            label="Username"
            name="name"
            type="text"
            register={register}
            error={errors.name}
            placeholder="Enter your username"
          />

          <FormGroup
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="Enter your email"
          />

          <FormGroup
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password}
            placeholder="Enter your password"
          />

          <FormGroup
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
          />

          <div className="space-y-2">
            <label className="block font-roboto text-input-label font-medium text-black">
              Role
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register("role")}
                  value="user"
                  className="h-4 w-4 text-primarymain focus:ring-primarylight border-neutral-main rounded-full"
                />
                <span className="ml-2 text-sm font-roboto text-black">
                  Users
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register("role")}
                  value="admin"
                  className="h-4 w-4 text-primarymain focus:ring-primarylight border-neutral-main rounded-full"
                />
                <span className="ml-2 text-sm font-roboto text-black">
                  Admin
                </span>
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm font-roboto text-status-error-main">
                {errors.role.message}
              </p>
            )}
          </div>

          <CustomButton
            label="Register"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          />
        </form>

        <div className="mt-1 text-center">
          <Link
            to="/"
            className="text-sm text-primarymain hover:text-primarydark"
          >
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
