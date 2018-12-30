export function addClass(el: HTMLElement, className: string) {
  if (el.classList) el.classList.add(className)
  else el.className += ' ' + className
}

export function removeClass(el: HTMLElement, className: string) {
  if (el.classList) el.classList.remove(className)
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
}

export function hasClass(el: HTMLElement, className: string) {
  if (el.classList) return el.classList.contains(className)
  else return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
}

export function toggleClass(el: HTMLElement, className: string) {
  if (hasClass(el, className)) removeClass(el, className)
  else addClass(el, className)
}

export function querySelector(selector: string) {
  return document.querySelector<HTMLElement>(selector)
}

export function data(selector: string, key: string) {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) return element.dataset[key]
}

export function attr(selector: string, key: string) {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) return element.getAttribute(key)
}
