const _JRCAppendChild = (parent, child) => {
    if (Array.isArray(child)) {
        //nested child
        child.forEach((nestedChild) => _JRCAppendChild(parent, nestedChild));
    }
    else if (typeof child == "string") {
        //text node
        parent.appendChild(document.createTextNode(child));
    }
    else {
        //normal child
        parent.appendChild(child);
    }
};
const _JRCSvgTags = [
    "animate",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "stop",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tspan",
    "use",
    "view"
];
const _JRCCreateElement = (tag, props, ...children) => {
    if (typeof tag === "function")
        return tag(props, children);
    let element;
    if (_JRCSvgTags.includes(tag)) {
        element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    }
    else {
        element = document.createElement(tag);
    }
    Object.entries(props || {}).forEach(([name, value]) => {
        if (name.startsWith("on") && name.toLowerCase() in window) {
            //this is an event (=> add event listener instead)
            element.addEventListener(name.toLowerCase().substring(2), value);
        }
        else {
            //this is a normal attribute
            element.setAttribute(name, value.toString());
        }
    });
    children.forEach((child) => {
        _JRCAppendChild(element, child);
    });
    return element;
};
