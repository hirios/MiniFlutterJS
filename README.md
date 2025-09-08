# MiniFlutterJS 
This repository contains a **MiniFlutterJS** inspired by the Flutter widget framework and accepting Tailwind as a style, with support for **rebuildable elements**. It allows you to declaratively create dynamic interfaces using widgets like Column, Row, Text, Button, ListView, Container, and others.

The repository offers two versions for use:

Static Version: Open directly in the browser, no server or modules needed.

Module Version: Use import/export (ES Modules), requires a local server or bundler.

<br>

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
        // document.querySelector('#element').rebuild()
        app.rebuild(); 
      }
    }),
    Spacer("2"),
    Button("Resetar", {
      onClick: () => {
        state.count = 0;
        // document.querySelector('#element').rebuild()
        app.rebuild();
      }
    })
  ], { className: "items-center gap-4" })
], { className: "gap-6 p-4" });

const root = document.getElementById('root');
root.appendChild(app);
```

<br>

### This is a rebuild widget
```javascript
Text(() => `Valor atual: ${state.count}`, { className: "text-lg" })
```

### This is not rebuild widget (Without function)
```javascript
Text(`Valor atual: ${state.count}`, { className: "text-lg" })
```

### This how you get and rebuild the widget
```javascript
// Text(() => `Valor atual: ${state.count}`, { id: "textCount", className: "text-lg" })

document.querySelector('#textCloud').rebuild()
```

### Tailwind CSS use className
```
{ id: "textCount", className: "text-lg" }
```
<br>

