import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  identifier: Yup.string()
    .required("Email or userName is required")
    .test(
      "email-or-username",
      "Enter a valid email or userName",
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const userNameRegex = /^[a-zA-Z0-9._-]{3,}$/;
        return emailRegex.test(value) || userNameRegex.test(value);
      }
    ),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters"),
});
