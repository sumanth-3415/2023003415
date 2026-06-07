/**
 * Notification Service
 * Handles fetching, prioritizing, and managing notifications
 */

const Logger = require('../../logging_middleware/logger');
const { sortByPriority } = require('../utils/priorityCalculator');

const API_URL = 'https://dummyjson.com/posts'; // Placeholder API - adjust as needed

/**
 * Fetch all notifications from the API
 * @returns {Promise<Array>} Array of notification objects
 */
async function fetchNotifications() {
  Logger.info('fetchNotifications', 'Starting to fetch notifications from API', {
    apiUrl: API_URL,
  });

  try {
    const startTime = Date.now();
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    const duration = Date.now() - startTime;

    Logger.performance('fetchNotifications', duration);
    Logger.success('fetchNotifications', 'Successfully fetched notifications', {
      count: data.posts?.length || data.length || 0,
    });

    return data.posts || data;
  } catch (error) {
    Logger.error('fetchNotifications', 'Failed to fetch notifications', error);
    throw error;
  }
}

/**
 * Transform API data to notification format
 * Add: type, timestamp, isRead status
 *
 * @param {Array} rawData - Raw data from API
 * @returns {Array} Transformed notification objects
 */
function transformToNotifications(rawData) {
  Logger.info('transformToNotifications', 'Starting transformation', {
    count: rawData.length,
  });

  try {
    const notifications = rawData.map((item, index) => ({
      id: item.id || index,
      title: item.title || 'Untitled',
      body: item.body || item.description || '',
      type: assignNotificationType(index), // Placeholder logic
      timestamp: item.timestamp || Date.now() - Math.random() * 86400000, // Random time in last 24h
      isRead: false,
    }));

    Logger.success('transformToNotifications', 'Transformation completed', {
      count: notifications.length,
    });

    return notifications;
  } catch (error) {
    Logger.error('transformToNotifications', 'Error during transformation', error);
    throw error;
  }
}

/**
 * Assign notification type based on index (placeholder logic)
 * In real app, this would come from the API
 *
 * @param {number} index - Index of notification
 * @returns {string} Type (Placement, Result, or Event)
 */
function assignNotificationType(index) {
  const types = ['Placement', 'Result', 'Event'];
  return types[index % 3];
}

/**
 * Get top 10 unread notifications sorted by priority
 * @returns {Promise<Array>} Top 10 unread notifications
 */
async function getTop10UnreadNotifications() {
  const startTime = Date.now();
  Logger.info('getTop10UnreadNotifications', 'Starting process');

  try {
    // Step 1: Fetch notifications
    const rawNotifications = await fetchNotifications();

    // Step 2: Transform to notification format
    const notifications = transformToNotifications(rawNotifications);

    // Step 3: Filter unread
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    Logger.info('getTop10UnreadNotifications', 'Filtered unread', {
      total: notifications.length,
      unread: unreadNotifications.length,
    });

    // Step 4: Sort by priority
    const sortedNotifications = sortByPriority(unreadNotifications);

    // Step 5: Get top 10
    const top10 = sortedNotifications.slice(0, 10);

    const duration = Date.now() - startTime;
    Logger.performance('getTop10UnreadNotifications', duration);
    Logger.success('getTop10UnreadNotifications', 'Successfully retrieved top 10', {
      count: top10.length,
    });

    return top10;
  } catch (error) {
    Logger.error('getTop10UnreadNotifications', 'Process failed', error);
    throw error;
  }
}

/**
 * Efficient Top-10 maintenance using Min Heap (simulation)
 * In production, use a proper heap data structure library
 *
 * @param {Array} currentTop10 - Current top 10 notifications
 * @param {Object} newNotification - Newly arrived notification
 * @returns {Array} Updated top 10
 */
function updateTop10WithNewNotification(currentTop10, newNotification) {
  Logger.info('updateTop10WithNewNotification', 'New notification arrived', {
    notificationId: newNotification.id,
  });

  try {
    const { calculatePriorityScore } = require('../utils/priorityCalculator');

    const newScore = calculatePriorityScore(newNotification);
    const updatedList = [...currentTop10, newNotification];
    const sorted = updatedList
      .map((n) => ({
        ...n,
        priorityScore: calculatePriorityScore(n),
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 10);

    Logger.success('updateTop10WithNewNotification', 'Top 10 updated', {
      count: sorted.length,
    });

    return sorted;
  } catch (error) {
    Logger.error(
      'updateTop10WithNewNotification',
      'Error updating top 10',
      error
    );
    throw error;
  }
}

module.exports = {
  fetchNotifications,
  transformToNotifications,
  getTop10UnreadNotifications,
  updateTop10WithNewNotification,
};
