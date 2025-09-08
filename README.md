# MiniFlutterJS 
This repository contains a **MiniFlutterJS** inspired by the Flutter widget framework and accepting Tailwind as a style, with support for **rebuildable elements**. It allows you to declaratively create dynamic interfaces using widgets like Column, Row, Text, Button, ListView, Container, and others.

The repository offers two versions for use:

Static Version: Open directly in the browser, no server or modules needed.

Module Version: Use import/export (ES Modules), requires a local server or bundler.



## Quick Start
```javascript
let state = { count: 0 };

const app = Column(() => [
  Text("MiniFlutterJS 🚀", { className: "text-2xl font-bold mb-4" }),

  Row(() => [
    Text(() => `Valor atual: ${state.count}`, { className: "text-lg" }),
    Spacer("4"),
    Button("Incrementar", {
      onClick: () => {
        state.count++;
        app.rebuild(); 
      }
    }),
    Spacer("2"),
    Button("Resetar", {
      onClick: () => {
        state.count = 0;
        app.rebuild();
      }
    })
  ], { className: "items-center gap-4" })
], { className: "gap-6 p-4" });

const root = document.getElementById('root');
root.appendChild(app);
```

# MiniFlutterJS 

Este repositório contém um **MiniFlutterJS** inspirado na estrutura de widgets do Flutter e que aceita Tailwind como estilo, com suporte a **rebuildable elements**. Ele permite criar interfaces dinâmicas de forma declarativa, usando widgets como `Column`, `Row`, `Text`, `Button`, `ListView`, `Container` e outros.

O repositório oferece **duas versões de uso**:

1. **Versão estática (Static)**: abrir direto no navegador, sem precisar de servidor ou módulos.
2. **Versão modular (Module)**: usar import/export (ES Modules), requer servidor local ou bundler.
