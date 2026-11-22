/** Rolagem suave até uma seção. */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: 'smooth' });
  history.replaceState(null, '', `#${id}`);
}

export const onAnchor = (id) => (e) => {
  e.preventDefault();
  scrollToId(id);
};
