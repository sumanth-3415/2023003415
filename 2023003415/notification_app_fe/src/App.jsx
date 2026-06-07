import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('All')
  const [now, setNow] = useState(Date.now())

  // Update "now" every second for relative timestamps
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5000/api/notifications')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setNotifications(data.data || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filter notifications
  const filtered = filter === 'All' 
    ? notifications 
    : notifications.filter(n => n.type === filter)

  // Get unique types
  const types = ['All', ...new Set(notifications.map(n => n.type))]

  // Get badge color by type
  const getBadgeColor = (type) => {
    switch(type) {
      case 'Placement': return '#FFB84D'
      case 'Result': return '#66BB6A'
      case 'Event': return '#42A5F5'
      default: return '#999'
    }
  }

  // Format timestamp (now is from state, not called during render)
  const formatTime = (timestamp) => {
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    if (seconds > 0) return `${seconds}s ago`
    return 'just now'
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📬 Notification Center</h1>
        <p>Top 10 Unread Notifications</p>
      </header>

      <div className="filters">
        <span>Filter by Type:</span>
        {types.map(type => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? 'active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="container">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>⚠️ Error: {error}</p>
            <p>Make sure the backend server is running on http://localhost:5000</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty">
            <p>📭 No notifications found</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid">
            {filtered.map(notification => (
              <div key={notification.id} className="card">
                <div className="card-header">
                  <span 
                    className="badge" 
                    style={{ backgroundColor: getBadgeColor(notification.type) }}
                  >
                    {notification.type}
                  </span>
                </div>
                <h3 className="card-title">{notification.title}</h3>
                <p className="card-message">{notification.body}</p>
                <div className="card-footer">
                  <span className="timestamp">
                    🕐 {formatTime(notification.timestamp)}
                  </span>
                  <span className="priority">
                    ⭐ {notification.priorityScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App