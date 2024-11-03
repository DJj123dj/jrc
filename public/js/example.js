//example div to render
function ExampleDiv(props) {
    return (_JRCCreateElement("div", null,
        "Hello ",
        props.name,
        "!"));
}
//render main
const ExampleMain = (_JRCCreateElement("main", null,
    _JRCCreateElement(ExampleDiv, { name: "World" }),
    _JRCCreateElement(ExampleDiv, { name: "Jasper" })));
//add content to page
document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(ExampleMain);
});
