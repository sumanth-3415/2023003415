/**
 * Logging Middleware - Reusable Logger
 * Logs: Timestamp, Function name, Operation, Status, Error details
 */

class Logger {
  /**
   * Log info level messages
   * @param {string} functionName - Name of the function being logged
   * @param {string} operation - What operation is being performed
   * @param {any} data - Additional data to log
   */
  static info(functionName, operation, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO - ${functionName} - ${operation}`, data);
  }

  /**
   * Log success level messages
   * @param {string} functionName - Name of the function being logged
   * @param {string} operation - What operation was successful
   * @param {any} data - Result data
   */
  static success(functionName, operation, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] SUCCESS - ${functionName} - ${operation}`, data);
  }

  /**
   * Log error level messages
   * @param {string} functionName - Name of the function where error occurred
   * @param {string} operation - What operation failed
   * @param {Error} error - Error object
   */
  static error(functionName, operation, error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR - ${functionName} - ${operation}`, {
      message: error.message,
      stack: error.stack,
    });
  }

  /**
   * Log performance metrics
   * @param {string} functionName - Name of the function
   * @param {number} duration - Time taken in milliseconds
   */
  static performance(functionName, duration) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PERFORMANCE - ${functionName} - ${duration}ms`);
  }
}

module.exports = Logger;
