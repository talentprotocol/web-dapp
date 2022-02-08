export const passwordMatchesRequirements = (password) => {
  const tags = ["Number", "Upper Case", "Lower Case", "8 Characters"];
  const lengthRegex = new RegExp("^.{8,}$");
  const lowercaseRegex = new RegExp("(?=.*[a-z])");
  const uppercaseRegex = new RegExp("(?=.*[A-Z])");
  const digitRegex = new RegExp("(?=.*[0-9])");
  const errors = {};
  let valid = true;

  // the keys must match the tag names
  if (!lengthRegex.test(password)) {
    errors["8 Characters"] = true;
    valid = false;
  } else {
    errors["8 Characters"] = false;
  }

  if (!lowercaseRegex.test(password)) {
    errors["Lower Case"] = true;
    valid = false;
  } else {
    errors["Lower Case"] = false;
  }

  if (!uppercaseRegex.test(password)) {
    errors["Upper Case"] = true;
    valid = false;
  } else {
    errors["Upper Case"] = false;
  }

  if (!digitRegex.test(password)) {
    errors["Number"] = true;
    valid = false;
  } else {
    errors["Number"] = false;
  }

  return { errors, valid, tags };
};
