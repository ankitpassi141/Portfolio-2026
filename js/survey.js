// City Pulse Survey — wires the globe and the form together.
// See reference/survey-page.md.
import { createGlobe } from './survey-globe.js?v=20261103a';
import { initSurvey } from './survey-form.js?v=20261103a';

let survey;
const globe = createGlobe(document.getElementById('globe'), {
  onCityClick: (id) => survey?.pickPlace(id),
});

survey = initSurvey({
  onChange(id, value) {
    if (id === 'traffic') globe.setTraffic(value);
    if (id === 'place') globe.flyTo(value);
  },
  onStep(id, value) {
    // show the roads up close while people rate their traffic
    if (id === 'traffic') { globe.setTraffic(value); globe.flyTo('harbor', 11.6); }
    if (id === 'place' && value) globe.flyTo(value);
  },
  onSubmit: () => globe.celebrate(),
});

document.getElementById('zoomIn').addEventListener('click', () => globe.zoom(0.72));
document.getElementById('zoomOut').addEventListener('click', () => globe.zoom(1.38));
document.getElementById('resetView').addEventListener('click', () => globe.reset());
const spin = document.getElementById('spin');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) spin.setAttribute('aria-pressed', 'false');
spin.addEventListener('click', () => {
  const on = spin.getAttribute('aria-pressed') !== 'true';
  spin.setAttribute('aria-pressed', String(on));
  globe.setSpin(on);
});
