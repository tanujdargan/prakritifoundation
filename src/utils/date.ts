// These are calendar dates ("2026-09-10"), not instants in time.
//
// Two traps, both of which put the wrong date on a tax document:
//   new Date('2026-09-10')        -> parsed as UTC midnight, so it renders as
//                                    09/09 in any negative-UTC-offset timezone.
//   new Date().toISOString()      -> the mirror problem: in IST (UTC+5:30) it
//                                    returns yesterday's date until 05:30 local.
//
// Neither helper below constructs a Date from a string, so neither can drift.

const pad = (n: number): string => String(n).padStart(2, '0');

/** Today's date as YYYY-MM-DD in the viewer's own calendar. */
export const todayLocalISO = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * Format a YYYY-MM-DD calendar date as DD/MM/YYYY (Indian convention).
 * Pure string manipulation, so the result never depends on the viewer's
 * timezone. Malformed input is passed through rather than throwing — a
 * receipt should not fail to render over a date it cannot parse.
 */
export const formatDateIN = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const [, year, month, day] = m;
  return `${day}/${month}/${year}`;
};
