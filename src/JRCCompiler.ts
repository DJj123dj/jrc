const _JRCAppendChild = (parent:HTMLElement, child:HTMLElement|HTMLElement[]|string) => {
	if (Array.isArray(child)){
        //nested child
		child.forEach((nestedChild) => _JRCAppendChild(parent,nestedChild))
    }else if (typeof child == "string"){
        //text node
        parent.appendChild(document.createTextNode(child))
    }else{
        //normal child
		parent.appendChild(child)
    }
}

export const _JRCCreateElement = (tag:(keyof HTMLElementTagNameMap)|((props:object|undefined, children:HTMLElement[]) => HTMLElement), props?:object, ...children:HTMLElement[]) => {
    if (typeof tag === "function") return tag(props, children)
	const element = document.createElement(tag)

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