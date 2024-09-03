import Joi from 'joi';

const registrationSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.empty': 'Name is required',
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'Email must be a valid email address',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(8).pattern(new RegExp(/[\W]/)).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one special character',
        'string.empty': 'Password is required',
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.empty': 'Confirm Password is required',
    }),
    agreeToTerms: Joi.boolean().valid(true).required().messages({
        'any.only': 'You must agree to the terms and policies',
    }),
});

export {
    registrationSchema
}