const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const { isAuthenticated } = require('../middleware/authenticate'); // Add this line

router.use('/api-docs', isAuthenticated, swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Protect the docs

module.exports = router;