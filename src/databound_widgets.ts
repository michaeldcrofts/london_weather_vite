
import { localStore } from "./data"

function largestFont(context: CanvasRenderingContext2D, text: string, width: number, height: number, font: string) {
    let fontSize = Math.floor(width / (text.length/2));
    context.font = fontSize.toString() + "px " + font;
    let txtWidth = context.measureText(text).width;
    while (txtWidth > width) {
        fontSize -= 1;
        context.font = fontSize.toString() + "px " + font;
        txtWidth = context.measureText(text).width;
    }
    while (fontSize > height) {
        fontSize -= 1;
    }
    return fontSize;
}

export class SelfUpdatingWidget{
    // Used to store the coordinate and callback data for a 'widget'. It's deliberately vaguely defined for wide ranging application.
    // To-do: Use as a parent class for subclasses with specific functionality, such as Textbox or Image.
    public x:number;
    public y:number;
    public w:number;
    public h:number;
    public updater: CallableFunction = ()=>{};
    constructor(x:number,y:number,w:number,h:number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

export class Textbox extends SelfUpdatingWidget {
    public context: CanvasRenderingContext2D;
    private text: string; private align: string; private color: string; private padding: number; private font: string; private fontSize: number; 
    private bgColor: string; private innerWidth: number; private innerHeight: number; private dataBindSrc: string; 
    public txtWidth: number;
    constructor(options : {context: CanvasRenderingContext2D, 
                           text: string, x: number, y: number, w: number, h: number,
                           charWidth?: number, align?: string, color?: string, bgColor?: string,
                           padding?: number, font?: string, fontSize?: number, dataBindSrc?: string}) {
        super(options.x,options.y,options.w,options.h);
        this.text = options.text;
        this.context = options.context;
        typeof(options.align) == "undefined" ? this.align = "center" : this.align = options.align;
        typeof(options.color) == "undefined" ? this.color = "white" : this.color = options.color;
        typeof(options.bgColor) == "undefined" ? this.bgColor = "none" : this.bgColor = options.bgColor;
        typeof(options.padding) == "undefined" ? this.padding = 10 : this.padding = options.padding;
        typeof(options.font) == "undefined" ? this.font = "Arial" : this.font = options.font;
        typeof(options.fontSize) == "undefined" ? this.fontSize = 0 : this.fontSize = options.fontSize;
        typeof(options.dataBindSrc) == "undefined" ? this.dataBindSrc = "" : this.dataBindSrc = options.dataBindSrc;
        
        if ( this.dataBindSrc != "" ){
            this.updater = ()=>{
                let data = localStore.get(this.dataBindSrc);
                if ( data  != null ) {
                    this.text = data;
                    if ( this.bgColor == "none" )  {    // Only clear the canvas area if it's transparent to reduce artefacting.
                        this.context.clearRect(this.x, this.y,this.w, this.h);
                    }
                    this.draw();
                }
            }
            localStore.set(this.dataBindSrc,this.text,this.updater);
        }
        this.innerWidth = this.w - 2 * this.padding;
        this.innerHeight = this.h - 2 * this.padding;
        let fontSize = largestFont(this.context, this.text, this.innerWidth, this.innerHeight, this.font);
        if ( this.fontSize > fontSize || !this.fontSize ) {     // Override nominated fontsize if it's too big
            this.fontSize = fontSize;
        } 
        this.context.font = this.fontSize.toString() + "px " + this.font;
        this.txtWidth = this.context.measureText(this.text).width;
    }
    public draw() {
        if ( this.bgColor != "none") {
            this.context.fillStyle = this.bgColor;
            this.context.fillRect(this.x, this.y,this.w, this.h);
        }
        this.context.fillStyle = this.color;
        this.context.textAlign = "left";
        let fontSize = largestFont(this.context, this.text, this.innerWidth, this.innerHeight, this.font);
        if ( this.fontSize > fontSize || !this.fontSize ) {     // Override nominated fontsize if it's too big
            this.fontSize = fontSize;
        } 
        this.context.font = this.fontSize.toString() + "px " + this.font;
        this.txtWidth = this.context.measureText(this.text).width;
        let yOffset = this.y+this.h - this.fontSize/2;          // Position at the bottom of the textbox
        yOffset -= (this.innerHeight - this.fontSize*1.45)/2;   // Vertical centre
        let xOffset =  this.x + this.padding;   // Left aligned
        if ( this.align == "center" ) {
            xOffset += (this.innerWidth -this.txtWidth) / 2;       // Horizontal centre
        } else if ( this.align == "right" ) {
            xOffset += this.innerWidth - this.txtWidth;             // Right
        }

        this.context.fillStyle = this.color;
        this.context.fillText(this.text, xOffset, yOffset);       
    }
    
}
