import {_JRCCreateElement} from "./JRCCompiler"

//example div to render
function ExampleDiv(props:{name:string}): HTMLDivElement {
    return (<div>Hello {props.name}!</div>)
}

//render main
const ExampleMain: HTMLDivElement = (<main>
    <ExampleDiv name="World"></ExampleDiv>
    <ExampleDiv name="Jasper"></ExampleDiv>
</main>)

//add content to page
document.addEventListener("DOMContentLoaded",() => {
    document.body.appendChild(ExampleMain)
})