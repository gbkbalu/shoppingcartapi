'use strict';
// Returning when validation fails
function validationHandler(res, error) {
  console.log("Validation failed", error)
  var errorMsg = error;
  var errDetails = [];
  if (error.details && error.details.length > 0) {
    errorMsg = error.details[0].message;
    errDetails = error.details;
  }
  return res.status(400).json({ statusCode: 400, status: false, success: false, validation: "Failed", message: errorMsg, isValid: false , details: errDetails});
}

// Returning when error occurs
function errorHandler(res, error, message, statusCode) {
  console.log("Error occured", error, message)
  return res.status(400).json(errorResponseObj(error, message, statusCode));
}

// Creating response json object based on error or custom message
function errorResponseObj(error, message, statusCode) {
  if(error){
    var errorMsg = error;
    if (error.errmsg !== null && error.errmsg !== undefined) {
      errorMsg = error.errmsg;
    }

    return { statusCode:statusCode,message:message,success: false, error: {}};
  }
  return { statusCode:statusCode,message:message,success: false};
}

exports.validationHandler = validationHandler;
exports.errorHandler = errorHandler;
exports.errorResponseObj = errorResponseObj;
