export const baseUrl = "http://localhost:5000/api/v1";

export const apiEndpoints = {
  signUp: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  getFeed:"/user/feed",
   Profile:"/profile/view",
  updateProfile:"/profile/update",
  connections:"/user/connections",
  request:"/user/request/received",
  createOrder:"/payment/order-create"
};

export const validations = {
    firstName: {
        required: "First name is required",
        minLength: {
            value: 4,
            message: "Minimum length should be 4",
        },
        maxLength: {
            value: 50,
            message: "Maximum length can be 50",
        },
    },
    lastName: {
        required: "Last name is required",
        minLength: {
            value: 4,
            message: "Minimum length should have 4 characters",
        },
        maxLength: {
            value: 50,
            message: "Maximum length can have 50 characters",
        },
    },
    email: {
        required: "Email is required",
        pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Email is not valid",
        },
    },
    password: {
        required: "Password is required",
        pattern: {
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
            message: "Password is not valid",
        },
    },
    gender: {
        validate: (gender) => {
            if(!["Male", "Female"].includes(gender)) return "Gender can be Male or Female";
        } 
    },
    about: {
        minLength: {
            value: 20,
            message: "Minimum length should be 20 characters",
        },
        maxLength: {
            value: 100,
            message: "Maximum length can have 100 characters",
        }
    }
};

export const signUpInputs = [
    {
        name: "firstName",
        label: "First Name",
    },
    {
        name: "lastName",
        label: "Last Name",
    },
    {
        name: "emailId",
        label: "Email ID",
    },
    {
        name: "password",
        label: "Password",
    },
];

export const loginInputs = [
    {
        name: "emailId",
        label: "Email ID",
    },
    {
        name: "password",
        label: "Password",
    },
];
export const profileInputs = [
    {
        name: "firstName",
        label: "First Name",
    },
    {
        name: "lastName",
        label: "Last Name",
    },
    {
        name: "gender",
        label: "Gender",
    },
    {
        name: "photoUrl",
        label: "Photo URL",
    },
    {
        name: "about",
        label: "About",
    },
];
