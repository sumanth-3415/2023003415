/**
 * Priority Calculator
 * Calculates priority score based on notification type and recency
 */

const Logger = require('../../logging_middleware/logger');

const PRIORITY_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Calculate priority score for a notification
 * Formula: (type_weight * 1000000) + recency_score
 * This ensures Placement > Result > Event, with newer notifications ranked higher
 *
 * @param {Object} notification - Notification object
 * @param {string} notification.type - Type of notification (Placement, Result, Event)
 * @param {number} notification.timestamp - Unix timestamp of notification
 * @returns {number} Priority score
 */
function calculatePriorityScore(notification) {
  Logger.info('calculatePriorityScore', 'Starting priority calculation', {
    type: notification.type,
    timestamp: notification.timestamp,
  });

  try {
    const typeWeight = PRIORITY_WEIGHTS[notification.type] || 0;
    const now = Date.now();
    const ageInSeconds = (now - notification.timestamp) / 1000;
    
    // Recency score: newer = higher score (inversely proportional to age)
    // Using a decay function: max recency at 0 age = 1000000, decays over time
    const recencyScore = Math.max(0, 1000000 - ageInSeconds);

    const priorityScore = typeWeight * 1000000 + recencyScore;

    Logger.info('calculatePriorityScore', 'Score calculated', {
      typeWeight,
      recencyScore,
      priorityScore,
    });

    return priorityScore;
  } catch (error) {
    Logger.error('calculatePriorityScore', 'Error calculating priority', error);
    throw error;
  }
}

/**
 * Sort notifications by priority score (descending)
 * @param {Array} notifications - Array of notification objects
 * @returns {Array} Sorted notifications
 */
function sortByPriority(notifications) {
  Logger.info('sortByPriority', 'Starting priority sorting', {
    count: notifications.length,
  });

  try {
    const sorted = notifications
      .map((notification) => ({
        ...notification,
        priorityScore: calculatePriorityScore(notification),
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);

    Logger.success('sortByPriority', 'Sorting completed', {
      count: sorted.length,
    });

    return sorted;
  } catch (error) {
    Logger.error('sortByPriority', 'Error during sorting', error);
    throw error;
  }
}

module.exports = {
  calculatePriorityScore,
  sortByPriority,
  PRIORITY_WEIGHTS,
};
