function makeRebuildable(el, builder) {
  el.rebuild = () => {
    el.innerHTML = "";
    const child = builder();
    if (Array.isArray(child)) child.forEach(c => c && el.appendChild(c));
    else if (child) el.appendChild(child);
  };
  el.rebuild();
  return el;
}

// helper para aceitar builder ou elementos diretos
function normalizeBuilder(input) {
  if (typeof input === "function") return input;
  if (Array.isArray(input)) return () => input;
  if (input) return () => [input];
  return () => [];
}

const Text = (builderOrValue, options={}) => {
  const el = document.createElement("span");
  return makeRebuildable(el, () => {
    el.className = `block ${options.className || ""}`;
    if (options.id) el.id = options.id;
    if (options.onClick) el.onclick = options.onClick;
    el.textContent = typeof builderOrValue === "function" ? builderOrValue() : builderOrValue;
    return null;
  });
};

const Container = (childrenOrBuilder, options={}) => {
  const el = document.createElement("div");
  if (options.onClick) el.onclick = options.onClick;
  return makeRebuildable(el, normalizeBuilder(childrenOrBuilder));
};

const Row = (childrenOrBuilder, options={}) => {
  const el = document.createElement("div");
  if (options.onClick) el.onclick = options.onClick;
  return makeRebuildable(el, () => {
    el.className = `flex flex-row ${options.className || ""}`;
    if (options.id) el.id = options.id;
    return normalizeBuilder(childrenOrBuilder)();
  });
};

const Column = (childrenOrBuilder, options={}) => {
  const el = document.createElement("div");
  if (options.onClick) el.onclick = options.onClick;
  return makeRebuildable(el, () => {
    el.className = `flex flex-col ${options.className || ""}`;
    if (options.id) el.id = options.id;
    return normalizeBuilder(childrenOrBuilder)();
  });
};

const Image = (srcOrBuilder, options={}) => {
  const el = document.createElement("img");
  if (options.onClick) el.onclick = options.onClick;
  return makeRebuildable(el, () => {
    el.className = options.className || "w-full h-auto";
    if (options.id) el.id = options.id;
    el.src = typeof srcOrBuilder === "function" ? srcOrBuilder() : srcOrBuilder;
    return null;
  });
};

const Button = (labelOrBuilder, options={}) => {
  const el = document.createElement("button");
  if (options.onClick) el.onclick = options.onClick;
  return makeRebuildable(el, () => {
    el.className = `bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${options.className || ""}`;
    if (options.id) el.id = options.id;
    el.textContent = typeof labelOrBuilder === "function" ? labelOrBuilder() : labelOrBuilder;
    return null;
  });
};

const Spacer = (size="4", options={}) => {
  const el = document.createElement("div");
  return makeRebuildable(el, () => {
    el.className = `h-${size} w-${size}`;
    if (options.id) el.id = options.id;
    if (options.onClick) el.onclick = options.onClick;
    return null;
  });
};

const Expanded = (childrenOrBuilder, options={}) => {
  const el = document.createElement("div");
  if (options.onClick) el.onclick = options.onClick;
  return makeRebuildable(el, () => {
    el.className = `flex-1 ${options.className || ""}`;
    if (options.id) el.id = options.id;
    return normalizeBuilder(childrenOrBuilder)();
  });
};

const ListView = (data, itemBuilder, options={}) => {
  const el = document.createElement("div");
  if (options.onClick) el.onclick = options.onClick;
  return makeRebuildable(el, () => {
    el.className = `flex flex-col ${options.className || ""}`;
    if (options.id) el.id = options.id;
    return data.map((item, index) => itemBuilder(item, index));
  });
};
