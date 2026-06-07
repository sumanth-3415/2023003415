

class Logger {
  /**
   
   * @param {string} functionName 
   * @param {string} operation 
   * @param {any} data
   */
  static info(functionName, operation, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO - ${functionName} - ${operation}`, data);
  }

  /**
   
   * @param {string} functionName 
   * @param {string} operation
   * @param {any} data 
   */
  static success(functionName, operation, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] SUCCESS - ${functionName} - ${operation}`, data);
  }

  /**
   
   * @param {string} functionName 
   * @param {string} operation 
   * @param {Error} error 
   */
  static error(functionName, operation, error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR - ${functionName} - ${operation}`, {
      message: error.message,
      stack: error.stack,
    });
  }

  /**
   
   * @param {string} functionName 
   * @param {number} duration 
   */
  static performance(functionName, duration) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PERFORMANCE - ${functionName} - ${duration}ms`);
  }
}

module.exports = Logger;
