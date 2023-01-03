import forecast from "./forecast";
import today from "./today";

export default class CanvasContainer {
    canvas; context; cachedWidth
    constructor(el: HTMLCanvasElement) {
        this.canvas = el;
        this.canvas.classList.add("day");
        this.context = this.canvas.getContext("2d")!;
        if (document.documentElement.clientWidth >= 1024) {
            this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio * 0.6;  // 60vw
            this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio * 0.6; // 60vw
        } else {
            this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio * 0.9;
            this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio * 0.9;
        }
        this.cachedWidth = document.documentElement.clientWidth;
        this.draw();
    }
    get() {
        return this.canvas;
    }
    draw() {
        let orientation: string = window.orientation == 90 || window.orientation == -90 || this.cachedWidth >= 1024 ? "landscape" : "portrait";
        if (orientation === "portrait") {
            let height: number = Math.floor(this.canvas.height/4);
            today(this.context,this.canvas.width,height,{x: 0, y: 10})
            .then((response) => {
                let vh: number = this.canvas.height * 0.01;
                let remaining = (100 * vh - 60 * vh - response) / 8;
                forecast(this.context,this.canvas.width,Math.floor(this.canvas.height/5),1,{x: 0, y: response + remaining})
                .then((response) => {
                    forecast(this.context,this.canvas.width,Math.floor(this.canvas.height/5),2,{x: 0, y: response + remaining})
                    .then((response) => {
                        forecast(this.context,this.canvas.width,Math.floor(this.canvas.height/5),2,{x: 0, y: response + remaining});
                    });
                });
            });
        } else {
            let width: number = Math.floor(this.canvas.width/3)
            today(this.context,width,this.canvas.height,{x: 0, y: 10})
            .then(() => {
                let vw: number = this.canvas.width * 0.01;
                forecast(this.context,Math.floor(this.canvas.width/5),this.canvas.height,1,{x: width+1*vw, y: 0});
                width += Math.floor(this.canvas.width/5)
                forecast(this.context,Math.floor(this.canvas.width/5),this.canvas.height,2,{x: width+3*vw, y: 0});
                width += Math.floor(this.canvas.width/5)
                forecast(this.context,Math.floor(this.canvas.width/5),this.canvas.height,3,{x: width+5*vw, y: 0});
            });
        }
        
    }
    resize() {
        if (this.cachedWidth !== document.documentElement.clientWidth) {
            if (document.documentElement.clientWidth >= 1024) {
                this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio * 0.6;  // 60vw
                this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio * 0.6; // 60vw
            } else {
                this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio * 0.9;
                this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio * 0.9;
            }
            this.cachedWidth = document.documentElement.clientWidth;
            this.draw();
        }
    }
}