declare module 'html2canvas' {
  interface Html2CanvasOptions {
    allowTaint?: boolean;
    backgroundColor?: string | null;
    canvas?: HTMLCanvasElement;
    foreignObjectRendering?: boolean;
    height?: number;
    imageTimeout?: number;
    ignoreElements?: (element: Element) => boolean;
    logging?: boolean;
    onclone?: (clonedDoc: Document) => void;
    onrendered?: (canvas: HTMLCanvasElement) => void;
    proxy?: string;
    removeContainer?: boolean;
    scale?: number;
    scrollX?: number;
    scrollY?: number;
    useCORS?: boolean;
    width?: number;
    x?: number;
    y?: number;
  }

  function html2canvas(element: Element | Document, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
  
  export = html2canvas;
}
