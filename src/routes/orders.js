const express = require('express');
const router = express.Router();
const { orders, GARMENT_PRICES, VALID_STATUSES } = require('../data');

function generateOrderId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${date}-${suffix}`;
}

function getEstimatedDelivery() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toISOString().slice(0, 10);
}

// POST /api/orders - Create a new order
router.post('/', (req, res) => {
  const { customer_name, phone, items } = req.body;

  if (!customer_name || !phone || !items || !items.length) {
    return res.status(400).json({ error: 'customer_name, phone, and items are required' });
  }

  let total_amount = 0;
  const processedItems = [];

  for (const item of items) {
    const garment = item.garment?.toLowerCase();
    const quantity = parseInt(item.quantity);

    if (!garment || !quantity || quantity < 1) {
      return res.status(400).json({ error: `Invalid item: ${JSON.stringify(item)}` });
    }

    const price = item.price_per_item ?? GARMENT_PRICES[garment];

    if (price === undefined) {
      return res.status(400).json({
        error: `Unknown garment "${garment}". Available: ${Object.keys(GARMENT_PRICES).join(', ')}`,
      });
    }

    const subtotal = price * quantity;
    total_amount += subtotal;
    processedItems.push({ garment, quantity, price_per_item: price, subtotal });
  }

  const newOrder = {
    id: generateOrderId(),
    customer_name,
    phone,
    items: processedItems,
    total_amount,
    status: 'RECEIVED',
    estimated_delivery: getEstimatedDelivery(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

// GET /api/orders - List orders with optional filters
router.get('/', (req, res) => {
  const { status, customer_name, phone, garment } = req.query;

  let result = [...orders];

  if (status) {
    result = result.filter(o => o.status === status.toUpperCase());
  }

  if (customer_name) {
    result = result.filter(o =>
      o.customer_name.toLowerCase().includes(customer_name.toLowerCase())
    );
  }

  if (phone) {
    result = result.filter(o => o.phone.includes(phone));
  }

  if (garment) {
    result = result.filter(o =>
      o.items.some(i => i.garment.includes(garment.toLowerCase()))
    );
  }

  res.json(result);
});

// GET /api/orders/:id - Get single order
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status?.toUpperCase())) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status.toUpperCase();
  order.updated_at = new Date().toISOString();

  res.json(order);
});

module.exports = router;
