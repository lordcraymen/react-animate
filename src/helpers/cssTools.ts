const kebabToCamel = (snakeString:string):string => snakeString != "" ? snakeString.replace( /([-_]\w)/g, g => g[ 1 ].toUpperCase() ) : "";

const camelToKebab = (camelString:string) => camelString;

const objectToCssString = (styleObject:{[index:string]:string}):string => {
    return styleObject ? Object.keys(styleObject).map((key) => camelToKebab(key) + ":" + styleObject[key] ).join(";") : ""
}

const cssStringToObject = (cssString:string):{[index:string]:string} => {
    return cssString != "" ? {} : {}
}

const nodelistToHTML = (node:NodeList) => Array.prototype.reduce.call(node, function(html, node) { return html + ( node.outerHTML || node.nodeValue );}, "");


export { camelToKebab, kebabToCamel, cssStringToObject, objectToCssString}