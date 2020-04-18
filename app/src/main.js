import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import Editor from "./components/editor";

ReactDOM.render(<Editor />, document.getElementById("root"));

// function getPageList() {
//   $("h1").remove();
//   $.get(
//     "./api",
//     (data) => {
//       data.forEach((file) => {
//         $("body").append(`<h1>${file}</h1>`);
//       });
//     },
//     "JSON"
//   );
// }

// getPageList();

// $("button").click(() => {
//   $.post(
//     "./api/createNewPage.php",
//     {
//       name: $("input").val(),
//     },
//     (data) => {
//       getPageList();
//     }
//   ).fail(() => {
//     alert("Cntra");
//   });
// });

// console.log("fefef");
