import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }
  if (options.username.length < 4) {
    return [
      {
        field: "username",
        message: "username must be at least 4 characters",
      },
    ];
  }
  if (options.password.length < 8) {
    return [
      {
        field: "password",
        message: "password must be at least 8 characters",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username can't include @",
      },
    ];
  }
  return null;
};
