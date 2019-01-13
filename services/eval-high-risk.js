const express = require('express');
const axios = require('axios');

const router = express.Router();

// Demo from TabulaRasa MedWise CDS Hooks demo
const riskBarDemo = `
<div><svg width="548px" height="175px" viewBox="0 0 548 175" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>MDS - Risk Score 50 of 50@1x</title>
<desc>Created with Sketch.</desc>
<defs>
<style type="text/css">@import url('https://fonts.googleapis.com/css?family=Roboto');</style>
    <rect id="path-1" x="0" y="0" width="500" height="48" rx="2.63491038"></rect>
</defs>
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="MDS---Risk-Score-50-of-50">
        <g id="row/Risk-Score-&amp;-Trend" transform="translate(24.000000, 14.000000)">
            <g id="Group-[16v-left]">
                <g id="Risk-Score" transform="translate(0.000000, 45.000000)">
                    <g id="Labels" transform="translate(2.000000, 54.698208)">
                        <g id="VeryHigh" transform="translate(408.000000, 0.000000)">
                            <g id="[_]-X-to-Y" transform="translate(13.000000, 24.000000)">
                                <text id="range" font-family="Roboto-Regular, Roboto" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                    <tspan x="23" y="15">36 - 50</tspan>
                                </text>
                                <g id="color/mds/level/veryHigh" transform="translate(0.000000, 1.000000)" fill="#FF0000">
                                    <rect id="Rectangle-3" x="0" y="0" width="18.9633702" height="18.9633702"></rect>
                                </g>
                            </g>
                            <text id="Very-High" font-family="Roboto-Regular," roboto="" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                <tspan x="16.169449" y="15">Very High</tspan>
                            </text>
                        </g>
                        <g id="High" transform="translate(306.000000, 0.000000)">
                            <g id="[_]-X-to-Y" transform="translate(13.000000, 24.000000)">
                                <text id="range" font-family="Roboto-Regular, Roboto" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                    <tspan x="23" y="15">20 - 35</tspan>
                                </text>
                                <g id="color/mds/level/high" transform="translate(0.000000, 1.000000)" fill="#FF9900">
                                    <rect id="Rectangle-3-Copy" x="0" y="0" width="18.9633702" height="18.9633702"></rect>
                                </g>
                            </g>
                            <text font-family="Roboto-Regular," roboto="" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                <tspan x="33.3838537" y="15">High</tspan>
                            </text>
                        </g>
                        <g id="Moderate" transform="translate(204.000000, 0.000000)">
                            <g id="[_]-X-to-Y" transform="translate(13.000000, 24.000000)">
                                <text id="range" font-family="Roboto-Regular, Roboto" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                    <tspan x="23" y="15">13 - 19</tspan>
                                </text>
                                <g id="color/mds/level/moderate" transform="translate(0.000000, 1.000000)" fill="#FCCC00">
                                    <rect id="Rectangle-3-Copy-2" x="0" y="0" width="18.9633702" height="18.9633702"></rect>
                                </g>
                            </g>
                            <text font-family="Roboto-Regular," roboto="" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                <tspan x="16.3547161" y="15">Moderate</tspan>
                            </text>
                        </g>
                        <g id="Low" transform="translate(102.000000, 0.000000)">
                            <g id="[_]-X-to-Y" transform="translate(14.000000, 24.000000)">
                                <text id="range" font-family="Roboto-Regular, Roboto" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                    <tspan x="23" y="15">6 - 12</tspan>
                                </text>
                                <g id="color/mds/level/low" transform="translate(0.000000, 1.000000)" fill="#FFFF99">
                                    <rect id="Rectangle-3-Copy-3" x="0" y="0" width="18.9633702" height="18.9633702"></rect>
                                </g>
                            </g>
                            <text font-family="Roboto-Regular," roboto="" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                <tspan x="35.2982808" y="15">Low</tspan>
                            </text>
                        </g>
                        <g id="Very-Low">
                            <g id="[_]-X-to-Y" transform="translate(18.000000, 24.000000)">
                                <text id="range" font-family="Roboto-Regular, Roboto" font-size="15.8094623" font-weight="normal" line-spacing="21.0792831" fill="#000000" fill-opacity="0.56">
                                    <tspan x="23" y="15">0 - 5</tspan>
                                </text>
                                <g id="color/mds/level/veryLow" transform="translate(0.000000, 1.000000)" fill="#99CCFF">
                                    <rect id="Rectangle-3-Copy-6" x="0" y="0" width="18.9633702" height="18.9633702"></rect>
                                </g>
                            </g>
                            <text font-family="Roboto-Bold," roboto="" font-size="15.8094623" font-weight="bold" line-spacing="21.0792831" fill="#000000" fill-opacity="0.87">
                                <tspan x="17.8098351" y="15">Very Low</tspan>
                            </text>
                        </g>
                    </g>
                    <g id="Graph">
                    <g id="tic-marks" opacity="0.5" transform="translate(99.000000, 47.000000)" fill="#646667" fill-rule="nonzero">
                    <polygon id="ticMark-veryLow" points="-9.97738003e-12 0.889068315 2 0.889068315 2 5.88906831 -9.97738003e-12 5.88906831"></polygon>
                    <polygon id="ticMark-moderate" points="100 0.889068315 102 0.889068315 102 5.88906831 100 5.88906831"></polygon>
                    <polygon id="ticMark-high" points="200 0.889068315 202 0.889068315 202 5.88906831 200 5.88906831"></polygon>
                    <polygon id="ticMark-veryHigh" points="300 0.889068315 302 0.889068315 302 5.88906831 300 5.88906831"></polygon>
                </g>
                        <mask id="mask-2" fill="white">
                            <use xlink:href="#path-1"></use>
                        </mask>
                        <use id="bg-(mask)" fill="#EFEFEF" xlink:href="#path-1"></use>
                        <g id="color/mds/level/veryHigh" mask="url(#mask-2)" fill="#96C9FB">
                            <rect id="Rectangle-3" x="0" y="0" width="60" height="47.9074615"></rect>
                        </g>
                        <text id="21-of-50" mask="url(#mask-2)" font-family="Roboto-Bold, Roboto" font-size="23.7192569" font-weight="bold" line-spacing="42.4958334" fill="#000000">
                            <tspan x="75" y="33">3</tspan>
                            <tspan x="95" y="33" font-family="Roboto-Italic, Roboto" font-style="italic" font-weight="normal">of </tspan>
                            <tspan x="130" y="33" font-family="Roboto-Regular, Roboto" font-weight="normal"> 50</tspan>
                        </text>
                    </g>
                </g>
                <text id="Medication-Risk-Scor" font-family="Roboto-Medium, Roboto" font-size="24.3120012" font-weight="400" fill="#000000">
                    <tspan x="0" y="23">Medication Risk Score: Very Low</tspan>
                </text>
                <text id="Medication-Risk-Score" font-family="Roboto-Medium, Roboto" font-size="24.3120012" font-weight="" fill="#E60000">
                    <tspan x="370" y="23"></tspan>
                </text>
            </g>
        </g>
    </g>
</g>
</svg></div>`;


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
      detail: riskBarDemo,
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
