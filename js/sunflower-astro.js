// Moon astronomy for the Sunflower page: position, phase and rise/set for a place and time.
// Same low-precision series as SunCalc (Vladimir Agafonkin, BSD-2): moon position good to ~0.3°, rise/set to a few minutes.
const RAD = Math.PI / 180, PI = Math.PI, E = RAD * 23.4397;
const DAY_MS = 86400000, J1970 = 2440588, J2000 = 2451545;
const toDays = date => date.valueOf() / DAY_MS - 0.5 + J1970 - J2000;
const rightAscension = (l, b) => Math.atan2(Math.sin(l) * Math.cos(E) - Math.tan(b) * Math.sin(E), Math.cos(l));
const declination = (l, b) => Math.asin(Math.sin(b) * Math.cos(E) + Math.cos(b) * Math.sin(E) * Math.sin(l));
const siderealTime = (d, lw) => RAD * (280.16 + 360.9856235 * d) - lw;

function sunCoords(d) {
  const M = RAD * (357.5291 + 0.98560028 * d), C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const L = M + C + RAD * 102.9372 + PI;
  return { dec: declination(L, 0), ra: rightAscension(L, 0) };
}
function moonCoords(d) {
  const L = RAD * (218.316 + 13.176396 * d), M = RAD * (134.963 + 13.064993 * d), F = RAD * (93.272 + 13.22935 * d);
  const l = L + RAD * 6.289 * Math.sin(M), b = RAD * 5.128 * Math.sin(F);
  return { ra: rightAscension(l, b), dec: declination(l, b), dist: 385001 - 20905 * Math.cos(M) };
}

// azimuth: degrees clockwise from north, altitude: degrees (refraction-corrected), parallactic angle: radians
export function moonPos(date, lat, lng) {
  const d = toDays(date), c = moonCoords(d), phi = RAD * lat, H = siderealTime(d, RAD * -lng) - c.ra;
  let h = Math.asin(Math.sin(phi) * Math.sin(c.dec) + Math.cos(phi) * Math.cos(c.dec) * Math.cos(H));
  h += RAD * 0.017 / Math.tan(h + RAD * 10.26 / (h + RAD * 5.1));
  const azS = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(c.dec) * Math.cos(phi));
  return { az: ((azS / RAD + 180) % 360 + 360) % 360, alt: h / RAD, dist: c.dist };
}

// fraction 0..1 of the disc that is lit; phase 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
export function moonPhase(date) {
  const d = toDays(date), s = sunCoords(d), m = moonCoords(d), sdist = 149598000;
  const phi = Math.acos(Math.sin(s.dec) * Math.sin(m.dec) + Math.cos(s.dec) * Math.cos(m.dec) * Math.cos(s.ra - m.ra));
  const inc = Math.atan2(sdist * Math.sin(phi), m.dist - sdist * Math.cos(phi));
  const angle = Math.atan2(Math.cos(s.dec) * Math.sin(s.ra - m.ra), Math.sin(s.dec) * Math.cos(m.dec) - Math.cos(s.dec) * Math.sin(m.dec) * Math.cos(s.ra - m.ra));
  return { fraction: (1 + Math.cos(inc)) / 2, phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / PI };
}
export function phaseName(p) {
  const names = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
  return names[Math.round(p.phase * 8) % 8];
}

// Next moonrise or moonset after `date` (searches 30 h ahead in 10-minute steps, then bisects). Returns { type, time } or null
// (the moon can skip a rise or set on some days, and near the poles for days at a time).
export function nextMoonEvent(date, lat, lng) {
  const alt = t => moonPos(new Date(t), lat, lng).alt;
  let t0 = date.valueOf(), a0 = alt(t0);
  for (let i = 1; i <= 180; i++) {
    const t1 = t0 + 600000, a1 = alt(t1);
    if ((a0 < 0) !== (a1 < 0)) {
      let lo = t0, hi = t1;
      for (let k = 0; k < 8; k++) { const mid = (lo + hi) / 2; if ((alt(mid) < 0) === (a0 < 0)) lo = mid; else hi = mid; }
      return { type: a1 > a0 ? 'rise' : 'set', time: new Date((lo + hi) / 2) };
    }
    t0 = t1; a0 = a1;
  }
  return null;
}
