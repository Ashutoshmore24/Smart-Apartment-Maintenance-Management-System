const db = require('../db');

// Utility function to create a notification (to be used by other controllers/routes)
const createNotification = (user_type, user_id, message) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO notifications (user_type, user_id, message) VALUES (?, ?, ?)`;
        db.query(sql, [user_type, user_id, message], (err, result) => {
            if (err) {
                console.error("Failed to create notification:", err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// GET notifications for a user
const getUserNotifications = (req, res) => {
    const { user_type, user_id } = req.params;
    const sql = `
        SELECT * FROM notifications 
        WHERE user_type = ? AND user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 50
    `;
    db.query(sql, [user_type.toUpperCase(), user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// PUT mark notification as read
const markAsRead = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE notifications SET is_read = TRUE WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Notification marked as read" });
    });
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead
};
