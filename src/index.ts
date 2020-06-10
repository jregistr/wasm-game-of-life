import hello from "./hello";

const helloHead = document.createElement("h1");
helloHead.append(document.createTextNode(hello()));

document.body.appendChild(helloHead);
