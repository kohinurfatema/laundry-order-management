const express = require('express');
const router = express.Router();
const { orders } = require('../data');

// GET /api/dashboard - Return summary stats
router.get('/', (req, res) => {
  const total_orders = orders.length;

  const total_revenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  const orders_by_status = {
    RECEIVED: 0,
    PROCESSING: 0,
    READY: 0,
    DELIVERED: 0,
  };

  orders.forEach(o => {
    orders_by_status[o.status]++;
  });

  const recent_orders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  res.json({
    total_orders,
    total_revenue,
    orders_by_status,
    recent_orders,
  });
});

module.exports = router;
