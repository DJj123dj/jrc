type HTMLSvgElement = HTMLElement|SVGElement
type Primitive<T extends number|string|boolean> = T extends number ? number : (T extends string ? string : (T extends boolean ? boolean : T))
const _JRCSvgTags: string[] = [   
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
]

const _JRCAppendChild = (parent:HTMLSvgElement, child:HTMLSvgElement|HTMLSvgElement[]|string|number) => {
	if (Array.isArray(child)){
        //nested child
		child.forEach((nestedChild) => _JRCAppendChild(parent,nestedChild))
    }else if (typeof child == "string"){
        //text node
        parent.appendChild(document.createTextNode(child))
    }else if (child instanceof HTMLElement || child instanceof SVGElement){
        //normal child
		parent.appendChild(child)
    }else{
        //text node (from number, boolean, etc)
        parent.appendChild(document.createTextNode(child.toString()))
    }
}

export const _JRCCreateElement = (tag:string|((props:object|undefined, children:HTMLSvgElement[]) => HTMLSvgElement), props?:object, ...children:HTMLSvgElement[]) => {
    if (typeof tag === "function") return tag(props, children)

    let element: HTMLSvgElement
    if (_JRCSvgTags.includes(tag)){
        element = document.createElementNS("http://www.w3.org/2000/svg",tag)
    }else{
        element = document.createElement(tag)
    }

	Object.entries(props || {}).forEach(([name, value]) => {
		if (name.startsWith("on") && name.toLowerCase() in window){
            //this is an event (=> add event listener instead)
			element.addEventListener(name.toLowerCase().substring(2),value)

        }else{
            //this is a normal attribute
            element.setAttribute(name,value.toString())
        }
	})

	children.forEach((child) => {
		_JRCAppendChild(element, child)
	})

	return element
}

export class _JRCState<Type extends number|string|boolean> {
    #value: Primitive<Type>
    #listeners: HTMLSpanElement[] = []

    constructor(initialState:Type){
        this.#value = initialState as Primitive<Type>
    }

    get state(){
        return this.#value
    }
    set state(value:Primitive<Type>){
        this.#value = value
        this.#listeners.forEach((element) => element.innerText = this.#value.toString())
    }
    setState(value:Primitive<Type>){
        this.#value = value
        this.#listeners.forEach((element) => element.innerText = this.#value.toString())
    }
    span(){
        const element: HTMLSpanElement = document.createElement("span")
        element.innerText = this.#value.toString()
        this.#listeners.push(element)
        return element
    }
    increaseState(increment:number, limit?:number){
        if (typeof this.#value != "number") throw new Error("_JRCState.increaseState() only works with numerical states! Booleans and strings don't work!")

        const current = this.#value as number
        if (typeof limit == "number" && current >= limit) return
        this.setState((current+increment) as Primitive<Type>)
    }
    decreaseState(decrement:number, limit?:number){
        if (typeof this.#value != "number") throw new Error("_JRCState.increaseState() only works with numerical states! Booleans and strings don't work!")

        const current = this.#value as number
        if (typeof limit == "number" && current <= limit) return
        this.setState((current-decrement) as Primitive<Type>)
    }
}