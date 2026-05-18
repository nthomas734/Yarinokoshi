// v5 — muted Cubs blue palette
// Token names (brass, accent, etc.) are preserved from prior versions so
// no component refactor is needed; values are remapped to the new palette.
export const theme = {
  bg:        '#1A2D52',  // muted Cubs blue — Chicago lake at dusk
  board:     '#0A0A0A',  // shared family black
  brass:     '#D6B97D',  // primary accent — cream-gold (distinct from family brass)
  cream:     '#F5EDE0',  // shared family text color
  surface:   '#0E1F3D',  // darker blue for cards/rows
  tileText:  '#FFF8EC',
  accent:    '#A89368',  // muted secondary accent (echo of cream-gold, dimmer)
  dim:       'rgba(245, 237, 224, 0.4)',
  dimmer:    'rgba(245, 237, 224, 0.15)',
  // status accents
  someday:  'rgba(245, 237, 224, 0.4)',
  planned:  '#D6B97D',  // cream-gold
  soon:     '#E8CF8E',  // brighter cream-gold (pulses)
  done:     '#6b8e6b'   // muted sage (kept — works well on blue)
};

export const sanDiegoDate = new Date('2027-09-30T00:00:00');

export function daysToSanDiego(): number {
  const now = new Date();
  const diff = sanDiegoDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
