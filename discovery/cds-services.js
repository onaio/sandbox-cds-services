const express = require('express');

const router = express.Router();
const serviceDefinitions = require('./service-definitions');
const eligibleVaccinesService = require('../services/eligible-vaccines');
const cmsPriceCheck = require('../services/cms-price-check');
const evalHighRisk = require('../services/eval-high-risk');

// Discovery Endpoint
router.get('/', (request, response) => {
  const discoveryEndpointServices = {
    services: serviceDefinitions,
  };
  response.json(discoveryEndpointServices);
});

// Routes to patient-greeting CDS Service
router.use('/eligible-vaccines', eligibleVaccinesService);
router.use('/cms-price-check', cmsPriceCheck);
router.use('/eval-high-risk', evalHighRisk);

module.exports = router;
