const orders = [];

const GARMENT_PRICES = {
  shirt: 150,
  pants: 180,
  saree: 350,
  jacket: 300,
  dress: 250,
  suit: 500,
  coat: 400,
  sweater: 200,
  jeans: 180,
  kurta: 120,
};

const VALID_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

module.exports = { orders, GARMENT_PRICES, VALID_STATUSES };
