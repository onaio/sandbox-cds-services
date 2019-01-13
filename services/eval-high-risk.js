const express = require('express');
const axios = require('axios');

const router = express.Router();

function isDataAvailable(patient) {
  return patient.name && patient.name[0] && patient.name[0].given && patient.name[0].given[0];
}

function isValidPrefetch(request) {
  const data = request.body;
  if (!(data && data.prefetch && data.prefetch.patient)) {
    return false;
  }
  return isDataAvailable(data.prefetch.patient);
}

function retrievePatientResource(fhirServer, patientId, accessToken) {
  const headers = { Accept: 'application/json+fhir' };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return axios({
    method: 'get',
    url: `${fhirServer}/Patient/${patientId}`,
    headers,
  }).then((result) => {
    if (result.data && isDataAvailable(result.data)) {
      return result.data;
    }
    throw new Error();
  });
}

function buildCard(patient) {
  const name = patient.name[0].given[0];
  const boxColor = '#0000ff';
  return {
    cards: [{
      summary: `Patient risk for: ${name}`,
      detail: '<div><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/svg" version="1.0" width="400" height="20"><defs><rect id="path-1" x="0" y="0" width="400" height="20" rx="2"></rect></defs><g id="color/mds/level/veryHigh" fill="' + boxColor + '"><rect id="Rectangle-3" x="0" y="0" width="400" height="20"></rect></g></svg></div>',
      source: {
        label: 'Evaluate patient risk',
      },
      indicator: 'info',
    }],
  };
}

// CDS Service endpoint
router.post('/', (request, response) => {
  if (!isValidPrefetch(request)) {
    const { fhirServer, fhirAuthorization } = request.body;
    let patient;
    if (request.body.context) {
      patient = request.body.context.patientId;
    }
    if (fhirServer && patient) {
      let accessToken;
      if (fhirAuthorization && fhirAuthorization.access_token) {
        accessToken = fhirAuthorization.access_token;
      }
      retrievePatientResource(fhirServer, patient, accessToken)
        .then((result) => {
          response.json(buildCard(result));
        }).catch(() => {
          response.sendStatus(412);
        });
      return;
    }
    response.sendStatus(412);
    return;
  }
  const resource = request.body.prefetch.patient;
  response.json(buildCard(resource));
});

module.exports = router;
