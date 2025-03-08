/**
 * Error handling middleware for Express.
 * This middleware captures errors and sends a formatted JSON response.
 *
 * @param {Object} err - The error object containing details about the error.
 * @param {Object} _req - The Express request object (unused, hence prefixed with `_`).
 * @param {Object} res - The Express response object used to send the error response.
 * @param {Function} _next - The next middleware function (unused, hence prefixed with `_`).
 */
const errorMiddleware = (err, _req, res, _next) => {
  // Create a copy of the error object to avoid modifying the original error reference
  let error = { ...err };

  // Ensure the error message is properly captured
  error.message = err.message;

  // Send a JSON response with the appropriate status code (defaulting to 500 for server errors)
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

export default errorMiddleware;
