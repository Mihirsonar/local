import {body} from "express-validator";

const registerValidation =() => {
    return [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long")
    ];
};

const loginValidation = () => {
    return [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password").notEmpty().withMessage("Password is required")
    ];
};

export { registerValidation, loginValidation };