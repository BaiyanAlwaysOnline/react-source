// import React from "../lib/react";
// import ReactDOM from "../lib/react-dom";

import React from "../lib/react";
import ReactDOM from "../lib/react-dom";

//
// const style = { border: "3px solid red", padding: "2px" };
//
// const element = (
//   <div id="A1" style={style}>
//     A1
//     <div id="B1" style={style}>
//       B1
//       <div id="C1" style={style}>
//         C1
//       </div>
//       <div id="C2" style={style}>
//         C2
//       </div>
//     </div>
//     <div id="B2" style={style}>
//       B2
//     </div>
//   </div>
// );
//
// let button1 = document.getElementById("button1")!;
// let button2 = document.getElementById("button2")!;
//
// button1.addEventListener("click", () => {
//   const element = (
//     <div id="A1" style={style}>
//       A1
//       <div id="B1" style={style}>
//         B1
//         <div id="C1" style={style}>
//           C1
//         </div>
//         <div id="C2" style={style}>
//           C2 - update
//         </div>
//         <div id="C3" style={style}>
//           C3
//         </div>
//         <span>C4</span>
//       </div>
//       <div id="B2" style={style}>
//         B2
//       </div>
//     </div>
//   );
//   ReactDOM.render(element, document.getElementById("root")!);
// });
//
// button2.addEventListener("click", () => {
//   const element = (
//     <div id="A1" style={style}>
//       A1
//       <div id="B1" style={style}>
//         B1
//         <div id="C2" style={{ ...style, ...{ border: "5px solid purple" } }}>
//           C2 - update2
//         </div>
//         <div id="C3" style={style}>
//           C3
//         </div>
//       </div>
//     </div>
//   );
//   ReactDOM.render(element, document.getElementById("root")!);
// });
//
// ReactDOM.render(element, document.getElementById("root")!);

import ClassComponent from "./ClassComponent";

ReactDOM.render(<ClassComponent />, document.getElementById("root")!);
