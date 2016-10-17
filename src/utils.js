export function rmItemFromArr(item, arr) {
  const idx = arr.indexOf(item);

  if (idx !== -1) {
    arr.splice(idx, 1);
  }
}

export function checkElIsInput(el) {
  return (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.hasAttribute('contenteditable'));
}
