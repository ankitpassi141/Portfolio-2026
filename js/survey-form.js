// City Pulse survey form — one question at a time, see reference/survey-page.md.
// Steps are plain data; render() rebuilds the step from STEPS[at].

// Set this to a URL that accepts a JSON POST (Formspree, a Google Apps Script,
// your own endpoint) to collect responses. Left empty, answers stay on the page.
const ENDPOINT = '';

export const STEPS = [
  {
    id: 'mode', type: 'choice', required: true,
    q: 'How do you usually get around?', hint: 'Pick the one you use most days.',
    options: [
      { v: 'car', t: 'Car', d: 'Driving myself' },
      { v: 'transit', t: 'Public transit', d: 'Bus, metro or train' },
      { v: 'bike', t: 'Bike or scooter' },
      { v: 'walk', t: 'On foot' },
      { v: 'mix', t: 'A mix', d: 'Depends on the day' },
    ],
  },
  {
    id: 'traffic', type: 'range', min: 1, max: 10, def: 5,
    q: 'How heavy is traffic where you live?', hint: 'Drag the slider and watch the roads on the globe.',
    ends: ['Empty streets', 'Gridlock'],
    words: ['', 'Empty', 'Very light', 'Light', 'Easy', 'Moderate', 'Busy', 'Heavy', 'Very heavy', 'Jammed', 'Gridlock'],
  },
  {
    id: 'place', type: 'choice', required: true,
    q: 'Where would you rather live?', hint: 'Choosing one flies the globe there. You can also tap a city on the globe.',
    options: [
      { v: 'harbor', t: 'Dense downtown', d: 'Harbor City · towers by the water' },
      { v: 'tech', t: 'Innovation district', d: 'Tech Park · campuses and offices' },
      { v: 'riverside', t: 'Quiet suburb', d: 'Riverside · low homes, wide streets' },
      { v: 'old', t: 'Historic quarter', d: 'Old Town · narrow lanes, old roofs' },
      { v: 'hill', t: 'Hillside town', d: 'Hill Station · small and green' },
    ],
  },
  {
    id: 'fixes', type: 'multi', required: true, max: 3,
    q: 'What would improve your commute most?', hint: 'Choose up to three.',
    options: [
      { v: 'transit', t: 'More frequent transit' },
      { v: 'bike', t: 'Safer bike lanes' },
      { v: 'walk', t: 'Better footpaths' },
      { v: 'lights', t: 'Smarter traffic lights' },
      { v: 'carfree', t: 'Car-free centre' },
      { v: 'remote', t: 'More remote work' },
    ],
  },
  {
    id: 'happy', type: 'rating', required: true,
    q: 'How happy are you with your commute today?', hint: '1 is miserable, 5 is great.',
    labels: ['Miserable', 'Unhappy', 'Okay', 'Good', 'Great'],
  },
  {
    id: 'note', type: 'text', max: 400,
    q: 'Anything else you would change about your city?', hint: 'Optional. A sentence is plenty.',
    placeholder: 'More trees on my street, a bus that runs after 10pm…',
  },
];

const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

export function initSurvey({ onChange = () => {}, onStep = () => {}, onSubmit = () => {} } = {}) {
  const form = document.getElementById('survey');
  let stepEl = document.getElementById('step');
  const bar = document.getElementById('bar');
  const count = document.getElementById('count');
  const err = document.getElementById('err');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const thanks = document.getElementById('thanks');
  const summary = document.getElementById('summary');

  let at = 0;
  const answers = {};
  for (const s of STEPS) if (s.type === 'range') answers[s.id] = s.def;

  function set(id, value) {
    answers[id] = value;
    err.textContent = '';
    onChange(id, value);
  }

  function optionHTML(s, o, kind) {
    const checked = kind === 'radio' ? answers[s.id] === o.v : (answers[s.id] || []).includes(o.v);
    return `<label class="opt${kind === 'checkbox' ? ' box' : ''}">
      <input type="${kind}" name="${s.id}" value="${esc(o.v)}"${checked ? ' checked' : ''}>
      <span class="mark" aria-hidden="true"></span>
      <span class="txt"><span class="t">${esc(o.t)}</span>${o.d ? `<span class="d">${esc(o.d)}</span>` : ''}</span>
    </label>`;
  }

  function render(focus = true) {
    const s = STEPS[at];
    bar.style.width = `${(at / STEPS.length) * 100}%`;
    count.textContent = `Question ${at + 1} of ${STEPS.length}`;
    prev.hidden = at === 0;
    next.textContent = at === STEPS.length - 1 ? 'Submit' : 'Next';
    err.textContent = '';

    let body = '';
    if (s.type === 'choice') body = `<div class="opts">${s.options.map((o) => optionHTML(s, o, 'radio')).join('')}</div>`;
    if (s.type === 'multi') body = `<div class="opts chips">${s.options.map((o) => optionHTML(s, o, 'checkbox')).join('')}</div>`;
    if (s.type === 'range') {
      body = `<div class="range">
        <output id="rangeOut" for="rangeIn"></output>
        <input id="rangeIn" type="range" min="${s.min}" max="${s.max}" step="1" value="${answers[s.id]}" aria-describedby="rangeOut">
        <div class="ends"><span>${esc(s.ends[0])}</span><span>${esc(s.ends[1])}</span></div>
      </div>`;
    }
    if (s.type === 'rating') {
      body = `<div class="rating">${s.labels.map((l, i) => `<label class="opt">
        <input type="radio" name="${s.id}" value="${i + 1}"${answers[s.id] === i + 1 ? ' checked' : ''} aria-label="${i + 1}, ${esc(l)}">
        <span class="n">${i + 1}</span><span class="d">${esc(l)}</span></label>`).join('')}</div>`;
    }
    if (s.type === 'text') {
      body = `<textarea id="textIn" maxlength="${s.max}" placeholder="${esc(s.placeholder)}" aria-labelledby="q-${s.id}"></textarea>
        <div class="chars" id="chars"></div>`;
    }

    // re-mount so the enter animation plays every step
    const fresh = stepEl.cloneNode(false);
    fresh.innerHTML = `<h2 class="q" id="q-${s.id}" tabindex="-1">${esc(s.q)}</h2><p class="hint">${esc(s.hint)}</p>${body}`;
    fresh.setAttribute('role', 'group');
    fresh.setAttribute('aria-labelledby', `q-${s.id}`);
    stepEl.replaceWith(fresh);
    stepEl = fresh;
    wire(s, fresh);
    if (focus) fresh.querySelector('.q').focus({ preventScroll: true });
    onStep(s.id, answers[s.id]);
  }

  function wire(s, root) {
    if (s.type === 'choice' || s.type === 'rating') {
      root.addEventListener('change', (e) => set(s.id, s.type === 'rating' ? Number(e.target.value) : e.target.value));
    }
    if (s.type === 'multi') {
      const boxes = [...root.querySelectorAll('input')];
      const sync = () => {
        const picked = boxes.filter((b) => b.checked).map((b) => b.value);
        boxes.forEach((b) => { b.disabled = !b.checked && picked.length >= s.max; });
        return picked;
      };
      sync();
      root.addEventListener('change', () => set(s.id, sync()));
    }
    if (s.type === 'range') {
      const input = root.querySelector('#rangeIn'), out = root.querySelector('#rangeOut');
      const show = () => { out.innerHTML = `${input.value}<small>${esc(s.words[input.value])}</small>`; };
      show();
      input.addEventListener('input', () => { show(); set(s.id, Number(input.value)); });
    }
    if (s.type === 'text') {
      const ta = root.querySelector('#textIn'), chars = root.querySelector('#chars');
      ta.value = answers[s.id] || '';
      const show = () => { chars.textContent = `${ta.value.length} / ${s.max}`; };
      show();
      ta.addEventListener('input', () => { answers[s.id] = ta.value; show(); });
    }
  }

  function valid(s) {
    if (!s.required) return true;
    const a = answers[s.id];
    if (s.type === 'multi') return Array.isArray(a) && a.length > 0;
    return a !== undefined && a !== '';
  }

  function describe(s, a) {
    if (a === undefined || a === '' || (Array.isArray(a) && !a.length)) return 'Skipped';
    if (s.type === 'choice') { const o = s.options.find((x) => x.v === a); return o.d && s.id === 'place' ? `${o.t} (${o.d.split(' · ')[0]})` : o.t; }
    if (s.type === 'multi') return a.map((v) => s.options.find((x) => x.v === v).t).join(', ');
    if (s.type === 'range') return `${a} / ${s.max} · ${s.words[a]}`;
    if (s.type === 'rating') return `${a} / 5 · ${s.labels[a - 1]}`;
    return a;
  }

  async function submit() {
    const payload = { ...answers, note: (answers.note || '').trim(), submittedAt: new Date().toISOString() };
    next.disabled = true;
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(res.status);
      } else {
        console.info('[survey] response (no ENDPOINT set):', payload);
      }
    } catch {
      err.textContent = 'Could not send your answers. Please try again.';
      next.disabled = false;
      return;
    }
    next.disabled = false;
    summary.innerHTML = STEPS.map((s) => `<div><dt>${esc(s.q)}</dt><dd>${esc(describe(s, answers[s.id]))}</dd></div>`).join('');
    bar.style.width = '100%';
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus({ preventScroll: true });
    onSubmit(payload);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const s = STEPS[at];
    if (!valid(s)) { err.textContent = s.type === 'multi' ? 'Pick at least one option.' : 'Please choose an answer to continue.'; return; }
    if (at === STEPS.length - 1) { submit(); return; }
    at++;
    render();
  });
  prev.addEventListener('click', () => { if (at > 0) { at--; render(); } });
  document.getElementById('again').addEventListener('click', () => {
    for (const k of Object.keys(answers)) delete answers[k];
    for (const s of STEPS) if (s.type === 'range') answers[s.id] = s.def;
    at = 0;
    thanks.hidden = true;
    form.hidden = false;
    render();
  });

  render(false);

  return {
    // a city tapped on the globe answers the "place" question when it is showing
    pickPlace(id) {
      if (STEPS[at].id !== 'place') return;
      const input = stepEl.querySelector(`input[value="${id}"]`);
      if (input) { input.checked = true; answers.place = id; err.textContent = ''; }
    },
  };
}
