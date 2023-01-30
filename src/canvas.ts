export class Canvas {
    private canvasHtmlEl: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private drawingObjs: Map<any, any>;
    constructor(width: number, height: number) {
        this.canvasHtmlEl = document.createElement('canvas');
        this.context = this.canvasHtmlEl.getContext("2d")!;
        this.canvasHtmlEl.width = window.devicePixelRatio * width;
        this.canvasHtmlEl.height = window.devicePixelRatio * height;
        this.drawingObjs = new Map<string, Picture | Label | Rectangle>();     // To-do: Extend to other types
    }

    public async get(): Promise<HTMLCanvasElement> {
        await this.draw();
        return Promise.resolve(this.canvasHtmlEl); 
    }

    public getCanvasProps(): {width: number, height: number} {
        return {
            width: this.canvasHtmlEl.width,
            height: this.canvasHtmlEl.height
        }
    }

    public add(key: string, obj: Picture | Label | Rectangle): void {          // To-do: Extend to other types
        this.drawingObjs.set(key, obj);
    }

    public remove(key: string): void {
        this.drawingObjs.delete(key);
    }

    public async draw(): Promise<void> {
        for (let item of this.drawingObjs.values()) {
            await item.draw(this.context);
        }
        return Promise.resolve();
    }

    public updateItem(key: string, properties: {}) {
        this.drawingObjs.get(key).set(properties);
    }

    public async drawItem(key: string): Promise<void> {
        if (this.drawingObjs.get(key) != undefined) {
            this.drawingObjs.get(key).draw(this.context);
        }
    }
}
export class Label {
    private options = {        // Defaults
        x: 0,
        y: 0,
        w: 100,
        h: 50,
        text: "",
        align: "center",
        color: "white",
        bgColor: "none",
        padding: 10,
        font: "Arial",
        fontSize: 0,
        overflow: "resize"
    };
    private innerWidth: number;
    private innerHeight: number;
    private txtWidth: number;

    constructor(options : { 
            x: number, 
            y: number, 
            w: number, 
            h: number,
            text?: string, 
            align?: string, 
            color?: string, 
            bgColor?: string,
            padding?: number, 
            font?: string, 
            fontSize?: number, 
            overflow?: "resize" | "hidden"}) {
        this.set(options);
        this.innerWidth = this.options.w - 2 * this.options.padding;
        this.innerHeight = this.options.h - 2 * this.options.padding;
        this.txtWidth = 0;
    }

    public set(options : object): void {
        for (let [key, value] of Object.entries(options)) {
            if (typeof(value) != "undefined") {
                this.options = Object.defineProperty(this.options, key, {value});
            }
        }
    }

    public get(): object {
        return this.options;
    }

    public async draw(context: CanvasRenderingContext2D): Promise<void> {
        if ( this.options.bgColor != "none") {
            context.fillStyle = this.options.bgColor;
            context.fillRect(this.options.x, this.options.y,this.options.w, this.options.h);
        }
        else {
            context.clearRect(this.options.x, this.options.y,this.options.w, this.options.h);
        }
        context.fillStyle = this.options.color;
        context.textAlign = "left";
        let fontSize = this.largestFont(context, this.options.text, this.innerWidth, this.innerHeight, this.options.font);
        if ( this.options.fontSize > fontSize || !this.options.fontSize ) {     // Override nominated fontsize if it's too big
            this.options.fontSize = fontSize;
        } 
        context.font = this.options.fontSize.toString() + "px " + this.options.font;
        this.txtWidth = context.measureText(this.options.text).width;
        let yOffset = this.options.y+this.options.h - this.options.fontSize/2;          // Position at the bottom of the textbox
        yOffset -= (this.innerHeight - this.options.fontSize*1.45)/2;   // Vertical centre
        let xOffset =  this.options.x + this.options.padding;   // Left aligned
        if ( this.options.align == "center" ) {
            xOffset += (this.innerWidth - this.txtWidth) / 2;       // Horizontal centre
        } else if ( this.options.align == "right" ) {
            xOffset += this.innerWidth - this.txtWidth;             // Right
        }
        context.fillStyle = this.options.color;
        context.fillText(this.options.text, xOffset, yOffset);
        return Promise.resolve();
    }

    private largestFont(context: CanvasRenderingContext2D, text: string, width: number, height: number, font: string): number {
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
}

export class Picture {
    private options = {        // Defaults
        x: 0,
        y: 0,
        w: 100,
        h: 50,
        imgSrc: "",
        sx: null,
        sy: null,
        sw: null,
        sh: null,
    };
    constructor(options : { 
            x: number, 
            y: number, 
            w: number, 
            h: number,
            imgSrc: string,
            sx?: number,
            sy?: number,
            sw?: number,
            sh?: number
        }) {
        this.set(options);
    }

    public set(options : object): void {
        for (let [key, value] of Object.entries(options)) {
            if (typeof(value) != "undefined") {
                this.options = Object.defineProperty(this.options, key, {value});
            }
        }
    }

    public get(): object {
        return this.options;
    }

    public async draw(context: CanvasRenderingContext2D): Promise<void> {
        let img = new Image();
        img.onload = () => {
            if (this.options.sx != null && this.options.sy != null
                && this.options.sw != null && this.options.sh != null) {
                Promise.all([
                    createImageBitmap(img, this.options.sx, this.options.sy, this.options.sw, this.options.sh)
                ]).then((icon) => {
                    let scale = this.options.w / icon[0].width;
                    context.drawImage(icon[0], this.options.x, this.options.y, this.options.w, icon[0].height * scale);
                });
            } else { 
                let scale = this.options.w / img.width;
                context.drawImage(img, this.options.x, this.options.y, this.options.w, img.height * scale);
            }
            return Promise.resolve();
        }
        img.src = this.options.imgSrc;
    }
}

export class Rectangle {
    private options = {        // Defaults
        x: 0,
        y: 0,
        w: 100,
        h: 50,
        bgColor: "none"
    };
    constructor(options : { 
            x: number, 
            y: number, 
            w: number, 
            h: number,
            bgColor?: string
        }) {
        this.set(options);
    }
    public set(options : object): void {
        for (let [key, value] of Object.entries(options)) {
            if (typeof(value) != "undefined") {
                this.options = Object.defineProperty(this.options, key, {value});
            }
        }
    }
    public get(): object {
        return this.options;
    }
    public draw(context: CanvasRenderingContext2D): Promise<void> {
        if (this.options.bgColor !== "none") {
            context.fillStyle = this.options.bgColor;
        }
        context.fillRect(this.options.x, this.options.y, this.options.w, this.options.h);
        return Promise.resolve();
    }
}
