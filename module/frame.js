function makeRebuildable(el, builder, options = {}) {
  el.rebuild = () => {
    el.innerHTML = "";

    // aplica id se existir
    if (options.id) el.id = options.id;

    // aplica onClick se existir
    if (options.onClick) {
      el.replaceWith(el.cloneNode(true)); 
      el.addEventListener("click", options.onClick);
    }

    const child = builder();
    if (Array.isArray(child)) child.forEach(c => c && el.appendChild(c));
    else if (child) el.appendChild(child);
  };
  el.rebuild(); // primeira renderização
  return el;
}

// Helper: transforma array ou elemento único em função builder
function normalizeBuilder(input) {
  if (typeof input === "function") return input;
  if (Array.isArray(input)) return () => input;
  if (input) return () => [input];
  return () => [];
}

export const Text = (builderOrValue, options = {}) => {
  const el = document.createElement("span");
  return makeRebuildable(
    el,
    () => {
      el.className = `block ${options.className || ""}`;
      el.textContent =
        typeof builderOrValue === "function" ? builderOrValue() : builderOrValue;
      return null;
    },
    options
  );
};

export const Container = (childrenOrBuilder, options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(el, normalizeBuilder(childrenOrBuilder), options);
};

export const Row = (childrenOrBuilder, options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(
    el,
    () => {
      el.className = `flex flex-row ${options.className || ""}`;
      return normalizeBuilder(childrenOrBuilder)();
    },
    options
  );
};

export const Column = (childrenOrBuilder, options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(
    el,
    () => {
      el.className = `flex flex-col ${options.className || ""}`;
      return normalizeBuilder(childrenOrBuilder)();
    },
    options
  );
};

export const Image = (srcOrBuilder, options = {}) => {
  const el = document.createElement("img");
  return makeRebuildable(
    el,
    () => {
      el.className = options.className || "w-full h-auto";
      el.src = typeof srcOrBuilder === "function" ? srcOrBuilder() : srcOrBuilder;
      return null;
    },
    options
  );
};

export const Button = (labelOrBuilder, options = {}) => {
  const el = document.createElement("button");
  return makeRebuildable(
    el,
    () => {
      el.className = `bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${options.className || ""}`;
      el.textContent =
        typeof labelOrBuilder === "function" ? labelOrBuilder() : labelOrBuilder;
      return null;
    },
    options
  );
};

export const Spacer = (size = "4", options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(
    el,
    () => {
      el.className = `h-${size} w-${size}`;
      return null;
    },
    options
  );
};

export const Expanded = (childrenOrBuilder, options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(
    el,
    () => {
      el.className = `flex-1 ${options.className || ""}`;
      return normalizeBuilder(childrenOrBuilder)();
    },
    options
  );
};

export const ListView = (data, itemBuilder, options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(
    el,
    () => {
      el.className = `flex flex-col ${options.className || ""}`;
      return data.map((item, index) => itemBuilder(item, index));
    },
    options
  );
};

export const Input = (options = {}) => {
  const el = document.createElement("input");
  return makeRebuildable(
    el,
    () => {
      el.type = options.type || "text";
      el.className = `border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500 ${options.className || ""}`;
      if (options.placeholder) el.placeholder = options.placeholder;
      if (options.value !== undefined) el.value = options.value;
      if (options.onInput) {
        el.oninput = (e) => options.onInput(e.target.value, e);
      }
      if (options.onChange) {
        el.onchange = (e) => options.onChange(e.target.value, e);
      }
      return null;
    },
    options
  );
};

export const Stack = (childrenOrBuilder, options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(
    el,
    () => {
      el.className = `relative ${options.className || ""}`;
      return normalizeBuilder(childrenOrBuilder)();
    },
    options
  );
};

export const Positioned = (childBuilder, options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(
    el,
    () => {
      el.className = `absolute ${options.className || ""}`;
      return normalizeBuilder(childBuilder)();
    },
    options
  );
};

