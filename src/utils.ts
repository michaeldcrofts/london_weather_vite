import { localStore } from "./data";

export var iconMap = {          // x & y coordinates for a 'sprite-sheet' of icons
    clear: { x: 0, y: 0 },
    partlyCloudy: { x: 145, y: 0 },
    lightRain: { x: 290, y: 0 },
    rain: { x: 435, y: 0 },
    heavyRain: { x: 580, y: 0 },
    storm: { x: 725, y: 0 },
};

export function isNight(): boolean {    // A very crude function, returns true between 6pm and midnight
    let hour: number = new Date().getHours();
    return hour >= 18 ? true : false;
}

export function scaleFont(text: string, width:number, height:number) {  
    // Returns the largest possible font-size to fit within width, although the calculation is a little crude it works for most use cases
    let fontSize = Math.floor(width / (text.length/2));
    while (fontSize * text.length/2 > width) {
        fontSize -= 1;
    }
    while (fontSize > height) {
        fontSize -= 1;
    }
    return fontSize;
}


export class selfUpdatingWidget{
    // Used to store the coordinate and callback data for a 'widget'. It's deliberately vaguely defined for wide ranging application.
    // To-do: Use as a parent class for subclasses with specific functionality, such as Textbox or Image.
    x:number;
    y:number;
    w:number;
    h:number;
    updater: CallableFunction = ()=>{};
    constructor(x:number,y:number,w:number,h:number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

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

export class Textbox extends selfUpdatingWidget {
    context: CanvasRenderingContext2D;
    text: string; align: string; color: string; padding: number; font: string; fontSize: number; bgColor: string;
    innerWidth: number; innerHeight: number; dataBindSrc: string; txtWidth: number;
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
                    this.context.clearRect(this.x, this.y,this.w, this.h);
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
    draw() {
        if ( this.bgColor != "noney") {
            //context.fillStyle = this.bgColor;
            this.context.fillStyle = "red";
            this.context.fillRect(this.x, this.y,this.w, this.h);
            this.context.fillStyle = "green";
            this.context.fillRect(this.x+this.padding, this.y+this.padding,this.w-2*this.padding, this.h-2*this.padding);
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
        
        this.context.fillStyle = "blue";
        this.context.fillRect(xOffset, this.y+this.padding, this.txtWidth, this.h-2*this.padding);

        this.context.fillStyle = this.color;
        this.context.fillText(this.text, xOffset, yOffset);       
    }
    
}

export function selfUpdatingText(context:CanvasRenderingContext2D, dataSrc:string, x:number, y: number, w: number, h: number) {
    // Creates an instance of selfUpdatingWidget to manage a textarea.
    // To-do: Turn this into a subclass of selfUpdatingWidget of Textbox. Enable the setting of a modifer to the string so that it can be used
    //        for temperature. Also setting of properties such as colour.
    let txt = new selfUpdatingWidget(x,y,w,h);
    txt.updater = ()=>{
        if (dataSrc.includes("wind") && dataSrc.includes("1") || dataSrc.includes("2") || dataSrc.includes("3")) { // Workaround to cope with a slight oversight for text draw on top of a filled area
            context.fillStyle = "rgba(68,114,196, 1)";
            context.fillRect(txt.x,txt.y,txt.w,txt.h);
        }
        else {
            context.clearRect(txt.x,txt.y,txt.w,txt.h);
        }
        context.fillStyle = "white";
        context.textAlign = "left";
        let fontSize = scaleFont(localStore.get(dataSrc)!, txt.w, txt.h);
        context.font = fontSize + "px Arial";
        context.fillText(localStore.get(dataSrc)!,txt.x+(txt.w-fontSize*localStore.get(dataSrc)!.length/2)/2,txt.y+fontSize+(txt.h-fontSize)/2);
    };
    let current = localStore.get(dataSrc);
    if (current == null || current == "undefined") {
        current = "-";
    }
    localStore.set(dataSrc,current,txt.updater);
}

export function toF(cent: number): number {
    return Math.round(((cent * 9 / 5) + 32));
}
export function toC(fah: number) : number {
    return fah == 0 ? 0 : Math.round((fah-32) / 1.8);
}

export function toggleUnit() {
    // Enables the toggle between units. It stores the unit in localStorage to be retrieved by the temperature text widgets.
    // Because the data storage is bound to callbacks we only need to change the values stored.
    if (centigrade) {
        localStorage.setItem("unit", "°F");
        centigrade = false;
        localStore.update("temp", toF(Number(localStore.get("temp"))).toString());
        localStore.update("tempDay1", toF(Number(localStore.get("tempDay1"))).toString());
        localStore.update("tempDay2", toF(Number(localStore.get("tempDay2"))).toString());
        localStore.update("tempDay3", toF(Number(localStore.get("tempDay3"))).toString());
    }
    else {
        localStorage.setItem("unit", "°C");
        centigrade = true;
        localStore.update("temp", toC(Number(localStore.get("temp"))).toString());
        localStore.update("tempDay1", toC(Number(localStore.get("tempDay1"))).toString());
        localStore.update("tempDay2", toC(Number(localStore.get("tempDay2"))).toString());
        localStore.update("tempDay3", toC(Number(localStore.get("tempDay3"))).toString());
    }
}

export function cancelTimeOuts() {  // Called when resizing the screen so to prevent widgets from updating during resize
    timeOutIds.forEach(id => {
        window.clearInterval(id);
    });
}

var centigrade: boolean = true;

export var timeOutIds:number[] = [];    // Array of timeOutIds from window.setInterval so they can be cancelled at a later point.

  