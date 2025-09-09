
let valor = 100;
let state = {
  count: 0,

};



const App = () => {
  const app = Column(() => [
    Row([
      Row([
        Text("Valores exclusivos só até", { className: "text-xl text-white font-bold" }),
        Text("30/09", { className: "text-xl text-[#FF601F] font-bold bg-[#D8FE00] px-1 p-px" })
      ], { className: "gap-2" }),
      Image("https://omie.com.br/assets/images/precos/esquenta-preco.png", { className: "w-[70px] relative bottom-2 right-[-10px]" })
    ], { className: "h-[40px] w-[400px] justify-between items-center py-2 pl-3 bg-[#FF601F] rounded-t-lg" }),

    Container([], { className: "h-[600px] w-[400px] border-4 border-orange-500 rounded-b-[15px]" })

  ], { className: "p-20 " });

  return app;
};








// const App = () => {
//   const app = Column(() => [
//     Text("MiniFlutterJS 🚀", { className: "text-2xl font-bold mb-4" }),

//     Row(() => [

//       Text(() => `Valor atual: ${state.count}`, { className: "text-lg" }),
//       Spacer("4"),
//       Button("Incrementar", {
//         onClick: () => {
//           state.count++;
//           app.rebuild();
//         }
//       }),

//       Spacer("2"),
//       Button("Resetar", {
//         onClick: () => {
//           state.count = 0;
//           app.rebuild();
//         }
//       }),


//     ], { className: "items-center gap-4" }),


//     Input({
//       placeholder: "Digite seu nome...",
//       onInput: (val) => {
//         nome = val;
//         console.log("Digitando:", nome);
//       },
//       onChange: (val) => {
//         console.log("Finalizou edição:", val);
//       },
//       className: "w-72"
//     }),


//     Stack([
//       Image("https://gkpb.com.br/wp-content/uploads/2025/08/burger-king-naruto-king-jr-2025-gkpb-banner-1.jpg", { className: "w-full h-auto" }),
//       Positioned(Text("Promoção!", { className: "text-white font-bold" }), {
//         className: "bottom-2 left-2 bg-black/50 px-2 py-1 rounded"
//       })
//     ], { className: "w-72 border" }),


//   ], { className: "gap-6 p-4" });

//   return app;
// };