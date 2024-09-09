const createElement = (tag, text, attributes = {}) => {
  const element = document.createElement(tag);
  element.textContent = text;
  for (const [key, value] of Object.entries(attributes)) {
    element[key] = value;
  }
  return element;
};

const createToggle = (label, initialState, onChangeHandler) => {
  const container = createElement("div", "", {
    className: "form-check form-switch",
  });
  const input = createElement("input", "", {
    className: "form-check-input",
    type: "checkbox",
    id: `${label.toLowerCase()}-toggle`,
    checked: initialState,
  });
  const labelElement = createElement("label", label, {
    className: "form-check-label",
    htmlFor: `${label.toLowerCase()}-toggle`,
  });

  input.onchange = onChangeHandler;
  container.appendChild(input);
  container.appendChild(labelElement);

  return container;
};

export { createElement, createToggle };
