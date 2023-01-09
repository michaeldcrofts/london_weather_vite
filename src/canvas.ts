import { cancelTimeOuts, isNight } from './utils';
import { SelfUpdatingWidget, Textbox } from "./databound_widgets"
import { localStore } from "./data";
import { getData } from "./async_fetch";
import { portrait, landscape } from "./display_layout";

const MAX_WIDTH: number = 1024;
const LARGE_SCREEN_SIZE: number = 0.6;  // 60vw/vh
const SMALL_SCREEN_SIZE: number = 0.9;  // 90vw/vh

export default class CanvasContainer {
    /* class CanvasContainer - contains and manages a canvas. It's responsible for managing the drawing and resizing 
       of the canvas on screen.
    */
    public canvas; public context; public cachedWidth; public vw; public vh; public objects;
    constructor(el: HTMLCanvasElement) {    
        // Sets the canvas up with some hard-coded percentages of the screen width and height.
        // Note: If these are changed here they must also be changed inside style.css to match!
        this.canvas = el;
        this.context = this.canvas.getContext("2d")!;
        if (document.documentElement.clientWidth >= MAX_WIDTH) {
            this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio * LARGE_SCREEN_SIZE;  
            this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio * LARGE_SCREEN_SIZE;
        } else {
            this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio * SMALL_SCREEN_SIZE;
            this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio * SMALL_SCREEN_SIZE;
        }
        this.cachedWidth = document.documentElement.clientWidth;
        this.vw = this.canvas.width * 0.01;
        this.vh = this.canvas.height * 0.01;
        this.objects = new Map<string, Textbox | SelfUpdatingWidget>();
        this.draw();
        getData();
    }
    public get(): HTMLCanvasElement {
        return this.canvas;
    }
    public add(key: string, obj: Textbox | SelfUpdatingWidget): void {
        this.objects.set(key, obj);
    }
    public draw(): void {
        let currentClass = localStore.get("cssClass");
        if ( currentClass != null ) {
            this.canvas.classList.remove(currentClass);
        }
        let cssClass: string = isNight() ? "night" : "day";
        localStore.set("cssClass", cssClass, ()=>{
            let cssClass = localStore.get("cssClass")!;
            this.canvas.classList.remove("night");
            this.canvas.classList.remove("day");
            this.canvas.classList.add(cssClass);    
        });
        this.canvas.classList.add(cssClass);
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
    public resize(): void {
        if (this.cachedWidth !== document.documentElement.clientWidth) {
            if (document.documentElement.clientWidth >= MAX_WIDTH) {
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
            this.objects = new Map<string, Textbox | SelfUpdatingWidget>();   // Delete canvas objects
            this.draw();
        }
    }
}