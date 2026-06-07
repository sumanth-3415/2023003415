

const Logger = require('../../logging_middleware/logger');
const { sortByPriority } = require('../utils/priorityCalculator');

const API_URL = 'https://dummyjson.com/posts'; 

/**
 * 
 * @returns {Promise<Array>} 
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
 
 *
 * @param {Array} rawData 
 * @returns {Array} 
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
 *
 * @param {number} index 
 * @returns {string} 
 */
function assignNotificationType(index) {
  const types = ['Placement', 'Result', 'Event'];
  return types[index % 3];
}

/**
 
 * @returns {Promise<Array>} 
 */
async function getTop10UnreadNotifications() {
  const startTime = Date.now();
  Logger.info('getTop10UnreadNotifications', 'Starting process');

  try {
   
    const rawNotifications = await fetchNotifications();


    const notifications = transformToNotifications(rawNotifications);

    
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    Logger.info('getTop10UnreadNotifications', 'Filtered unread', {
      total: notifications.length,
      unread: unreadNotifications.length,
    });

    
    const sortedNotifications = sortByPriority(unreadNotifications);


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


 * @param {Array} currentTop10 
 * @param {Object} newNotification 
 * @returns {Array} 
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
