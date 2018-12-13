export function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  else el.className += ' ' + className;
}

export function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);
  else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

export function hasClass(el, className) {
  if (el.classList) return el.classList.contains(className);
  else return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

export function toggleClass(el, className) {
  if (hasClass(el, className)) removeClass(el, className);
  else addClass(el, className);
}
