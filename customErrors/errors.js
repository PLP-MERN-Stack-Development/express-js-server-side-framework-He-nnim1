class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'Fail' : 'Error';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}


class NotFound extends AppError{
    constructor(resource = 'resource'){
        super(`${resource} not found`, 404);
    }
}

class ValidationError extends AppError{
    constructor(message = 'Invalid Input'){
        super(message, 400);
    }
}

class ForbiddenError extends AppError{
    constructor(message = 'Not Authorized'){
        super(message, 403);
    }
}

class AuthenticationError extends AppError{
    constructor(message = 'Authentication failed'){
        super(message, 401)
    }
}


module.exports = {
    AppError,
    NotFound,
    ValidationError,
    ForbiddenError,
    AuthenticationError
}