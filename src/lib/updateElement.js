import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  for (const key in oldProps) {
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      removeEvent(target, key.toLowerCase().slice(2), oldProps[key]);
    }
  }

  for (const key in newProps) {
    if (key.startsWith("on") && typeof newProps[key] === "function") {
      addEvent(target, key.toLowerCase().slice(2), newProps[key]);
    } else if (key === "className") {
      target.className = newProps[key];
    } else if (key === "disabled") {
      target.disabled = newProps[key];
    } else if (key === "selected") {
      if (newProps[key]) {
        target.selected = true;
      } else {
        target.selected = false;
      }
    } else if (key === "value") {
      target.value = newProps[key];
    } else if (key.startsWith("data-")) {
      target.setAttribute(key, newProps[key]);
    } else {
      target.setAttribute(key, newProps[key]);
    }
  }

  for (const key in oldProps) {
    if (!(key in newProps) && !key.startsWith("on")) {
      target.removeAttribute(key);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index];

  if (!newNode) {
    if (currentElement) {
      parentElement.removeChild(currentElement);
    }
    return;
  }

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (currentElement && currentElement.nodeType === Node.TEXT_NODE) {
      currentElement.textContent = newNode.toString();
    } else {
      const textNode = document.createTextNode(newNode.toString());
      if (currentElement) {
        parentElement.replaceChild(textNode, currentElement);
      } else {
        parentElement.appendChild(textNode);
      }
    }
    return;
  }

  if (typeof newNode === "object" && newNode.type) {
    if (
      !currentElement ||
      currentElement.nodeType !== Node.ELEMENT_NODE ||
      currentElement.tagName.toLowerCase() !== newNode.type.toLowerCase()
    ) {
      const newElement = createElement(newNode);
      if (currentElement) {
        parentElement.replaceChild(newElement, currentElement);
      } else {
        parentElement.appendChild(newElement);
      }
      return;
    }

    updateAttributes(currentElement, newNode.props, oldNode?.props);

    // 자식 요소 업데이트
    const newChildren = newNode.children || [];

    while (currentElement.firstChild) {
      currentElement.removeChild(currentElement.firstChild);
    }

    for (const child of newChildren) {
      const childElement = createElement(child);
      if (childElement) {
        currentElement.appendChild(childElement);
      }
    }
  }
}
