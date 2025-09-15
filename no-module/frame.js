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
  const el = document.createElement("div");
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

// ==================== DragList corrigido ====================
let __sortable_uid = 0;
const DragList = (data, itemBuilder, options = {}) => {
  const el = document.createElement("div");

  return makeRebuildable(
    el,
    () => {
      el.className = `flex flex-col gap-2 ${options.className || ""}`;

      const items = data.map((item, index) => {
        const child = itemBuilder(item, index);
        // garante que é elemento DOM
        if (child && child.classList) {
          child.classList.add("cursor-move", "select-none");
        }
        return child;
      });

      // Inicializa ou reinicializa SortableJS
      setTimeout(() => {
        if (el._sortable) {
          try { el._sortable.destroy(); } catch(e) {}
        }

        // copia opções e remove props que não fazem sentido pro Sortable direto
        const sortableOptions = { animation: 150, ...options };
        delete sortableOptions.className; // não é opção do Sortable

        // Propriedades que podem receber múltiplas classes (tailwind)
        const mcProps = ["chosenClass", "ghostClass", "dragClass"];
        const extras = {};    // extras[prop] = [array de classes] ou null
        const tokens = {};    // tokens[prop] = tokenSeguro a ser passado pro Sortable
        const uid = (++__sortable_uid) + "_" + Math.random().toString(36).slice(2,6);

        mcProps.forEach(prop => {
          const v = options[prop];
          if (typeof v === "string" && v.trim().includes(" ")) {
            // split em tokens reais e cria um token seguro para o Sortable
            extras[prop] = v.trim().split(/\s+/);
            tokens[prop] = `${prop}_${uid}`; // single token, sem espaços
            sortableOptions[prop] = tokens[prop];
          } else if (typeof v === "string" && v.trim().length) {
            extras[prop] = null;            // não precisa de tratamento extra
            sortableOptions[prop] = v.trim();
          } else {
            extras[prop] = null;
            // deixa undefined se não informado
          }
        });

        // Preserve callbacks do usuário para encadear
        const userCallbacks = {
          onClone: options.onClone,
          onChoose: options.onChoose,
          onUnchoose: options.onUnchoose,
          onStart: options.onStart,
          onEnd: options.onEnd,
          onSort: options.onSort,
          onAdd: options.onAdd,
          onRemove: options.onRemove
        };

        // Helpers para chamar callback do usuário se existir
        const callUser = (name, evt) => {
          const fn = userCallbacks[name];
          if (typeof fn === "function") {
            try { fn(evt); } catch (e) { console.error("erro callback user", name, e); }
          }
        };

        // Hooks que adicionam / removem as classes "extras" (split) onde necessário
        sortableOptions.onClone = function(evt) {
          // clone pode receber ghostClass extras
          try {
            if (extras.ghostClass && evt.clone && evt.clone.classList) {
              evt.clone.classList.add(...extras.ghostClass);
            }
          } catch(e) { /* ignore */ }
          callUser("onClone", evt);
        };
        sortableOptions.onChoose = function(evt) {
          try {
            if (extras.chosenClass && evt.item && evt.item.classList) {
              evt.item.classList.add(...extras.chosenClass);
            }
          } catch(e) {}
          callUser("onChoose", evt);
        };
        sortableOptions.onUnchoose = function(evt) {
          try {
            if (extras.chosenClass && evt.item && evt.item.classList) {
              evt.item.classList.remove(...extras.chosenClass);
            }
          } catch(e) {}
          callUser("onUnchoose", evt);
        };
        sortableOptions.onStart = function(evt) {
          try {
            if (extras.dragClass && evt.item && evt.item.classList) {
              evt.item.classList.add(...extras.dragClass);
            }
          } catch(e) {}
          callUser("onStart", evt);
        };
        sortableOptions.onEnd = function(evt) {
          try {
            if (extras.dragClass && evt.item && evt.item.classList) {
              evt.item.classList.remove(...extras.dragClass);
            }
            if (extras.chosenClass && evt.item && evt.item.classList) {
              evt.item.classList.remove(...extras.chosenClass);
            }
            if (extras.ghostClass && evt.clone && evt.clone.classList) {
              evt.clone.classList.remove(...extras.ghostClass);
            }
          } catch(e) {}
          callUser("onEnd", evt);
        };

        // Cria o Sortable
        try {
          el._sortable = Sortable.create(el, sortableOptions);
        } catch (e) {
          console.error("Erro ao criar Sortable:", e);
        }
      });

      return items;
    },
    options
  );
};
