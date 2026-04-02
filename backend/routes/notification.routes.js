const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead } = require('../controllers/notification.controller');

// Get notifications for a specific user
router.get('/:user_type/:user_id', getUserNotifications);

// Mark a single notification as read
router.put('/read/:id', markAsRead);

module.exports = router;
