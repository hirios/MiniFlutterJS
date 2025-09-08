import {
    Text,
    Container,
    Row,
    Column,
    Image,
    Button,
    Spacer,
    Expanded,
    ListView
} from './frame.js';


export const App = () => {
    let state = { count: 0 };

    const app = Column(() => {
        return [
            Text("MiniFlutterJS 🚀", { className: "text-2xl font-bold mb-4" }),

            Row(() => [
                Text(() => "Valor atual: " + state.count, { id: "textCount", className: "text-lg" }),
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
        ];
    }, { className: "gap-6 p-4" });

    return app;
};