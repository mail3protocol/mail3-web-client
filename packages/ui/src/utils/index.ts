export const unifyImage = (url: any) =>
  typeof url === 'string' ? url : url?.src

export const unifySvg = (svg: any) =>
  typeof svg === 'function' ? svg : svg?.ReactComponent
