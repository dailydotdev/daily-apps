export function getElementIndexFromSiblings(targetElement) {
  let index = 0;
  let element = targetElement.previousElementSibling;
  while (element !== null) {
    element = element.previousElementSibling;
    index += 1;
  }

  return index;
}

export default {
  getElementIndexFromSiblings
}