import * as Yup from "yup";

export const signupValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .required("Username is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(4, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters")
    .required("Password is required"),
});
