const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred';

    console.error(`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}`);

    if(err.stack){
        console.error(err.stack);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_DEV === 'development' && { stack: err.stack})
    });
}

module.exports = errorHandler;