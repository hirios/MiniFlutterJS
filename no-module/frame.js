// A função central que "melhora" um elemento, adicionando o método rebuild
// e aplicando opções comuns como id e onClick.
function makeRebuildable(el, builder, options = {}) {
  el.rebuild = () => {
    el.innerHTML = "";

    // Centraliza a aplicação de id e onClick
    if (options.id) el.id = options.id;
    if (options.onClick) {
      // Usando addEventListener para melhor gerenciamento de eventos
      // a remoção do listener antigo garante que não haja duplicação
      // Ao invés de replaceWith, uma abordagem mais simples e clara
      el.removeEventListener("click", options.onClick);
      el.addEventListener("click", options.onClick);
    }

    const child = builder();
    if (Array.isArray(child)) child.forEach(c => c && el.appendChild(c));
    else if (child) el.appendChild(child);
  };
  el.rebuild(); // Primeira renderização
  return el;
}

// Helper: transforma array ou elemento único em função builder
function normalizeBuilder(input) {
  if (typeof input === "function") return input;
  if (Array.isArray(input)) return () => input;
  if (input) return () => [input];
  return () => [];
}

// ======================= WIDGETS =======================

const Text = (builderOrValue, options = {}) => {
  const el = document.createElement("span");
  return makeRebuildable(
    el,
    () => {
      el.className = `block ${options.className || ""}`;
      el.textContent = typeof builderOrValue === "function" ? builderOrValue() : builderOrValue;
      return null;
    },
    options
  );
};

const Container = (childrenOrBuilder, options = {}) => {
  const el = document.createElement("div");
  return makeRebuildable(
    el,
    () => {
      if (options.className) el.className = options.className;
      return normalizeBuilder(childrenOrBuilder)();
    },
    options
  );
};

const Row = (childrenOrBuilder, options = {}) => {
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

const Column = (childrenOrBuilder, options = {}) => {
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

const Image = (srcOrBuilder, options = {}) => {
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

const Button = (labelOrBuilder, options = {}) => {
  const el = document.createElement("button");
  return makeRebuildable(
    el,
    () => {
      el.className = `bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${options.className || ""}`;
      el.textContent = typeof labelOrBuilder === "function" ? labelOrBuilder() : labelOrBuilder;
      return null;
    },
    options
  );
};

const Spacer = (size = "4", options = {}) => {
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

const Expanded = (childrenOrBuilder, options = {}) => {
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

const ListView = (data, itemBuilder, options = {}) => {
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

const Input = (options = {}) => {
  const el = document.createElement("input");
  return makeRebuildable(
    el,
    () => {
      el.type = options.type || "text";

      // Classes padrão e extras
      el.className = `border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500 ${options.className || ""}`;

      // Permite definir placeholder e value
      if (options.placeholder) el.placeholder = options.placeholder;
      if (options.value !== undefined) el.value = options.value;

      // Permite passar style diretamente
      if (options.style) Object.assign(el.style, options.style);

      // Eventos
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


const Stack = (childrenOrBuilder, options = {}) => {
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

const Positioned = (childBuilder, options = {}) => {
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