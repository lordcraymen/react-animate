type SVGimage = {id:string};
declare module "*.svg" {
  const content: SVGimage;
  export default content;
}

type CSS = any;
declare module "*.scss" {
  const content: CSS;
  export default content;
}