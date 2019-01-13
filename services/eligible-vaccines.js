const express = require('express');
const axios = require('axios');
const moment = require('moment');

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

function getVaccinesForDate(birthDate) {
    const ageInMonths = moment().diff(birthDate, 'months');
    let vaccines;

    if (ageInMonths < 36) {
        vaccines = [
          {
            vaccine: "BCG",
            hasVx: false,
          },
          {
            vaccine: "IPV",
            hasVx: false,
          },
        ];
    } else {
        vaccines = [
          {
            vaccine: "BCG2",
            hasVx: true,
          },
          {
            vaccine: "BCG3",
            hasVx: false,
          },
          {
            vaccine: "IPV2",
            hasVx: false,
          },
        ];
    }

    return vaccines;
}

function buildVaccineCardsForPatient(patient) {
  const name = patient.name[0].given[0];
  const birthDate = new moment().format(patient.birthDate);
  const vaccinesForDate = getVaccinesForDate(birthDate);
  let receivedText;

  return vaccinesForDate.reduce(
    function (vaccineCards, vaxObj) {
      let receivedText = vaxObj.hasVx ? '' : 'not';
      let boxColor = vaxObj.hasVx ? '#00ff00' : '#ff0000';
      let i = vaccineCards.length;
      return vaccineCards.concat([{
        summary: `${name} ${vaxObj.vaccine} Vaccine`,
        detail: `
<div>
  <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/svg" version="1.0" width="20" height="20">
    <defs><rect id="vax-path-${i}" x="0" y="0" width="20" height="20" rx="2"></rect></defs>
    <g id="color/mds/level/veryHigh" fill="${boxColor}">
      <rect id="Vax-Rectangle-${i}" x="0" y="0" width="20" height="20"></rect>
    </g>
  </svg>
</div>${name} has ${receivedText} received the ${vaxObj.vaccine} vaccine.`,
        source: {
          label: 'Eligible vaccines service',
        },
        indicator: vaxObj.hasVx ? 'info' : 'critical',
      }]);
    },
    []
  );
}

function buildCard(patient) {
  cards = buildVaccineCardsForPatient(patient);
  return {
    cards: cards,
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
