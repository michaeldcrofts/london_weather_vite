import { cancelTimeOuts, isNight, selfUpdatingWidget, Textbox } from './utils';
import { localStore } from "./data";
import { getData } from "./async_fetch";
import { portrait, landscape } from "./display_layout";

export default class CanvasContainer {
    /* class CanvasContainer - contains and manages a canvas. It's responsible for managing the drawing and resizing 
       of the canvas on screen.
    */
    canvas; context; cachedWidth; vw; vh; objects;
    constructor(el: HTMLCanvasElement) {    
        // Sets the canvas up with some hard-coded percentages of the screen width and height.
        // Note: If these are changed here they must also be changed inside style.css to match!
        this.canvas = el;
        let cssClass: string = isNight() ? "night" : "day";
        this.canvas.classList.add(cssClass);
        this.context = this.canvas.getContext("2d")!;
        if (document.documentElement.clientWidth >= 1024) {
            this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio * 0.6;  // 60vw
            this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio * 0.6; // 60vh
        } else {
            this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio * 0.9;   // 90vw
            this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio * 0.9; // 90vh
        }
        this.cachedWidth = document.documentElement.clientWidth;
        this.vw = this.canvas.width * 0.01;
        this.vh = this.canvas.height * 0.01;
        this.objects = new Map<string, Textbox | selfUpdatingWidget>();
        this.draw();
        getData();
    }
    get() {
        return this.canvas;
    }
    add(key: string, obj: Textbox | selfUpdatingWidget) {
        this.objects.set(key, obj);
    }
    draw() {
        if (this.canvas.width < this.canvas.height) {   // Portrait
            for ( let key of portrait.keys() ) {
                let options = portrait.get(key);
                let optionsMod = { x: options!.x, y: options!.y, w: options!.w, h: options!.h, canvasContainer: this}
                key(optionsMod);
                /* OptionsMod is a little odd, but the following worked in dev but would not compile:
                   key(Object.assign(options,{canvasContainer:this}));
                */
            }
        } else {        // Landscape
            for ( let key of landscape.keys() ) {
                let options = landscape.get(key)!;
                let optionsMod = { x: options!.x, y: options!.y, w: options!.w, h: options!.h, canvasContainer: this}
                key(optionsMod);
            }
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
            this.vw = this.canvas.width * 0.01;
            this.vh = this.canvas.height * 0.01;
            cancelTimeOuts();   // Remove any timer callbacks
            localStore.cancelCallbacks();      // Delete all the callbacks for the data bound objects
            this.objects = new Map<string, Textbox | selfUpdatingWidget>();   // Delete canvas objects
            this.draw();
        }
    }
}