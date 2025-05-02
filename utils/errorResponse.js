const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.status(err.statusCode || 500).json({
        sucess : false,
        message : err.message || 'Server Error'
    });
};

module.exports = errorHandler;   
                                                                                                                                                                                                                                       