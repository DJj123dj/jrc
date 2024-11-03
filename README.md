# Jaspers React-like Compiler (JRC)
I know, it's yet another Javascript Framework, but this one is very small (just about 2KB).
It doesn't need react, but it uses the `tsc` to compile the jsx code.

> ### ❌ No Support
> This compiler is open source, but isn't made for public usage. **Use it at your own risk.**
> - Feature requests won't be accepted.
> - Bugs and issues won't be solved.
> - I won't provide support with setting it up.

### Usage:
You can just write like any other JSX language. The only difference is that this one doesn't contain any special features.
It's just pure JSX to HTML. But it is more than enough for most applications.

```tsx
import {_JRCCreateElement} from "./JRCCompiler"

//example renderable div
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
```

It will generate a script that you can import in a HTML file. You also need to import the compiler itself for it to work.
```html
<!DOCTYPE html>
<html>
    <head>
        <script src="./js/JRCCompiler.js"></script>
        <script src="./js/example.js"></script>
    </head>
    <body>

    </body>
</html>
```