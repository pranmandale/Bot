import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { Eye, EyeOff } from "lucide-react"; // <-- Lucide icons
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../features/auth/authSlice.js";
import { loginValidationSchema } from "../validationSchema/loginSchema.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const handleLogin = async (values, resetForm) => {
  const payload = {
    email: values.identifier,
    password: values.password
  };

  await toast.promise(
    dispatch(loginUser(payload)).unwrap(),
    {
      loading: "Logging in...",
      success: (res) => {
        // `res` is the backend response
       
        // resetForm();
        
        return res?.message || "Login successful! 🎉";
      },
      error: (err) => {
        return err?.message || "Login failed ❌";
      }
    }
  );
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Welcome Back
        </h2>

        <Formik
          initialValues={{ identifier: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await handleLogin(values, resetForm);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              {/* Identifier */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email or Mobile
                </label>
                <Field
                  type="text"
                  name="identifier"
                  placeholder="Enter email or mobile"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 outline-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.identifier && touched.identifier && (
                  <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={isVisible ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 outline-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 text-sm underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
              >
                Log In
              </button>

              {/* Signup link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 underline"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
