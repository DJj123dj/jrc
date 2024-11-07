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

        }else if (typeof value != "undefined"){
            //this is a normal attribute
            element.setAttribute(name,value.toString())
        }
	})

	children.forEach((child) => {
        if (typeof child != "undefined" && child != null) _JRCAppendChild(element, child)
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

export function _JRCClassStyle(props:{class:string}): string {
    return props.class
}

class _JRCClassStyleElement {
    element: HTMLSvgElement
    scopes: {scopeId:string, styles:{id:string, style:string}[], initialStyle: string, element:HTMLSvgElement}[] = []
    styles: {id:string, style:string}[] = []
    currentStyleId: string|null = null
    initialStyle: string

    constructor(element:(manager:_JRCClassStyleElement) => HTMLSvgElement){
        this.element = element(this)
        this.initialStyle = this.element.classList.value
    }

    /**Register a scope. */
    registerScope(scopeId:string, element:HTMLSvgElement){
        this.scopes.push({scopeId,styles:[],element,initialStyle:element.classList.value})
        return element
    }
    /**Register a style for a scope. */
    registerScopeStyle(scopeId:string, id:string, style:string, initial?:boolean){
        //add style that doesn't exist yet (required for next & previous to work correctly)
        if (!this.styles.find((s) => s.id === id)) this.styles.push({id,style:""})

        const scope = this.scopes.find((s) => s.scopeId === scopeId)
        if (!scope) return this
        scope.styles.push({id,style})
        if (initial) this.#setScopeStyle(scopeId,id)
        return this
    }
    /**Use a style from a scope. */
    #setScopeStyle(scopeId:string, id?:string){
        if (!id) return
        this.currentStyleId = id
        const scope = this.scopes.find((s) => s.scopeId === scopeId)
        if (!scope) return
        const style = scope.styles.find((s) => s.id === id)
        if (!style) return
        scope.element.classList.value = scope.initialStyle+" "+style.style
    }

    /**Register a style for the global element. */
    registerGlobalStyle(id:string, style:string, initial?:boolean){
        //create style or overwrite when it already exists.
        const i = this.styles.findIndex((s) => s.id === id)
        if (i > -1){
            this.styles[i] = {id,style}
        }else this.styles.push({id,style})

        if (initial) this.#setGlobalStyle(id)
        return this
    }
    /**Use a style from the global element. */
    #setGlobalStyle(id?:string){
        if (!id) return
        this.currentStyleId = id
        const style = this.styles.find((s) => s.id === id)
        if (!style) return
        this.element.classList.value = this.initialStyle+" "+style.style
    }
    
    /**Set the style. */
    setStyle(id:string){
        this.#setGlobalStyle(id)
        this.scopes.forEach((s) => this.#setScopeStyle(s.scopeId,id))
    }
    /**Go to the next style. */
    nextStyle(){
        if (!this.currentStyleId){
            //use first style
            if (this.styles[0]) this.#setGlobalStyle(this.styles[0].id)
            this.scopes.forEach((s) => this.#setScopeStyle(s.scopeId,s.styles[0].id))
        }else{
            //find current style
            const i = this.styles.findIndex((s) => s.id === this.currentStyleId)
            if (i > -1 && this.styles[i+1]){
                //use next style
                this.#setGlobalStyle(this.styles[i+1].id)
                this.scopes.forEach((s) => this.#setScopeStyle(s.scopeId,s.styles[i+1]?.id))
            }else if (i > -1){
                //go back to first style
                this.#setGlobalStyle(this.styles[0].id)
                this.scopes.forEach((s) => this.#setScopeStyle(s.scopeId,s.styles[0].id))
            }
        }
    }
    /**Go to the previous style. */
    previousStyle(){
        if (!this.currentStyleId){
            //use first style
            if (this.styles[0]) this.#setGlobalStyle(this.styles[0].id)
            this.scopes.forEach((s) => this.#setScopeStyle(s.scopeId,s.styles[0].id))
        }else{
            //find current style
            const i = this.styles.findIndex((s) => s.id === this.currentStyleId)
            if (i > -1 && this.styles[i-1]){
                //use next style
                this.#setGlobalStyle(this.styles[i-1].id)
                this.scopes.forEach((s) => this.#setScopeStyle(s.scopeId,s.styles[i-1]?.id))
            }else if (i > -1){
                //go back to last style
                const last = this.styles.at(-1)
                if (!last) return
                this.#setGlobalStyle(last.id)
                this.scopes.forEach((s) => this.#setScopeStyle(s.scopeId,s.styles.at(-1)?.id))
            }
        }
    }
}

export function _JRCInteractiveElement(element:(manager:_JRCClassStyleElement) => HTMLSvgElement){
    return new _JRCClassStyleElement(element)
}