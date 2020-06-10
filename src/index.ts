import hello from "./hello";
import * as wasm from "wasm-rust"

const helloHead = document.createElement("h1");
helloHead.append(document.createTextNode(hello()));

document.body.appendChild(helloHead);

wasm.greet();


