// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }

  // 배열 타입 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    for (const child of vNode) {
      const childElement = createElement(child);
      if (childElement) {
        fragment.appendChild(childElement);
      }
    }
    return fragment;
  }

  // 중첩 처리
  if (typeof vNode === "object") {
    const element = document.createElement(vNode.type);
    updateAttributes(element, vNode.props);

    for (const child of vNode.children) {
      const childElement = createElement(child);
      if (childElement) {
        element.appendChild(childElement);
      }
    }

    return element;
  }
}

function updateAttributes($el, props) {
  if (!props) return;

  for (const key in props) {
    if (key === "className") {
      $el.className = props[key];
    } else {
      $el.setAttribute(key, props[key]);
    }
  }
}
