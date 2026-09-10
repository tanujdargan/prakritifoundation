// Self-check for the date helpers. Not imported by the app, so it is never
// bundled. Run it directly:
//
//   node src/utils/date.check.ts
//   TZ=America/New_York node src/utils/date.check.ts
//   TZ=Asia/Kolkata     node src/utils/date.check.ts
//
// It must pass under every timezone — that is the whole point of the helpers.

import assert from 'node:assert/strict';
import { formatDateIN, todayLocalISO } from './date.ts';

const tz = process.env.TZ ?? '(system default)';

// formatDateIN is pure string work, so it is timezone-independent by construction.
assert.equal(formatDateIN('2026-09-10'), '10/09/2026');
assert.equal(formatDateIN('2026-01-05'), '05/01/2026');
assert.equal(formatDateIN('2026-12-31'), '31/12/2026');
// Leap day must survive.
assert.equal(formatDateIN('2028-02-29'), '29/02/2028');
// Malformed input passes through instead of throwing or rendering "Invalid Date".
assert.equal(formatDateIN(''), '');
assert.equal(formatDateIN('not-a-date'), 'not-a-date');

// todayLocalISO must agree with the LOCAL calendar day, in any timezone.
const now = new Date();
const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
assert.match(todayLocalISO(), /^\d{4}-\d{2}-\d{2}$/);
assert.equal(todayLocalISO(), expected);

// Regression guard: the two constructs these helpers exist to replace.
// `new Date(iso)` treats a date-only string as UTC midnight, so west of
// Greenwich it formats as the day before. Assert our helper does NOT.
const iso = '2026-09-10';
const viaDateObject = new Date(iso).toLocaleDateString('en-GB');
const viaHelper = formatDateIN(iso);
if (new Date().getTimezoneOffset() > 0) {
  // Negative UTC offset (e.g. America/New_York): the old way was wrong here.
  assert.notEqual(viaHelper, viaDateObject, 'helper should not reproduce the UTC-midnight off-by-one');
}
assert.equal(viaHelper, '10/09/2026', 'helper must be stable regardless of timezone');

console.log(`✓ date helpers pass under TZ=${tz} (todayLocalISO=${todayLocalISO()}, formatDateIN('${iso}')=${viaHelper})`);
