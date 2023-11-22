const express = require('express');
const essaysRoutes = require('./essays/routes');

const router = express.Router();

router.use('/essays', essaysRoutes);

module.exports = router;