export const baseUrl = import.meta.env.VITE_API_BASE_URL
export const apiEndpoints = {
    user: "/user",
    publicProfile: "/user/profile",
    signUp: "/auth/signup",
    login: "/auth/login",
    sendOtp: "/auth/send-otp",
    googleLogin: "/auth/google-login",
    logout: "/auth/logout",
    getFeed: "/user/feed",
    Profile: "/profile/view",
    updateProfile: "/profile/update",
    connections: "/user/connections",
    request: "/user/request/received",
    createOrder: "/payment/checkout",
    isPremium: "/payment/isPremium",
    chats: "/chat/fetch",
    fetchAllBlogs: "/blogs/fetch",
    fetchSingleBlog: "/blogs/fetch/:blogId",
    createBlog: "/blogs/create",
    updateBlog: "/blogs/update/:blogId",
    deleteBlog: "/blogs/delete/:blogId",
    imagekitAuth: "/blogs/imagekit-auth",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    likeBlog: "/blogs/:blogId/like",
    addComment: "/blogs/:blogId/comment",
    fetchComments: "/blogs/:blogId/comments",
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
            if (!["Male", "Female"].includes(gender)) return "Gender can be Male or Female";
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

/**
 * Single source of truth for checking if a user has an active Premium membership on the frontend.
 * Membership is Premium only if:
 * • Membership exists (user exists and has plan === "PREMIUM")
 * • Status is Active (subscriptionStatus === "active")
 * • Expiry date is greater than current date (if subscriptionEndDate is present)
 *
 * @param {Object} user - User object from Redux or API
 * @returns {boolean} True if user is an active Premium member, false otherwise
 */
export const isUserPremium = (user) => {
    if (!user) return false;
    const isPremiumPlan = user.plan === "PREMIUM";
    const isActiveStatus = user.subscriptionStatus === "active";
    const hasValidExpiry = !user.subscriptionEndDate || new Date(user.subscriptionEndDate) > new Date();
    return Boolean(isPremiumPlan && isActiveStatus && hasValidExpiry);
};
