
import * as config from "../config.json";
import { Canvas, Label, Picture, Rectangle } from "../canvas";
import { localStore } from "../data";
import { isNight } from "./utils";
import { toggleUnit } from "./dataProcessing";

var portraitView: Canvas;
var landscapeView: Canvas;
var currentView: Canvas;
var cachedWidth: number;


function addEventListenerToCanvas(): void {
    const canvasElements = document.querySelectorAll("canvas") as NodeListOf<HTMLCanvasElement>;
    canvasElements.forEach(canvas => {
      canvas.addEventListener("click", toggleUnit);
    });
  }

function loadImg(objOptions: {
    type: string,
    x: number,
    y: number,
    w: number,
    h: number,
    dataSrc: string,
    args: {} }, vw: number, vh: number): Picture {
    let pic: Picture;
    if (objOptions.dataSrc === "iconMap") {
    let spriteX = config.iconMap.default.x;
    let spriteY = isNight() ? config.iconMap.nightOffset : config.iconMap.default.y;
    // Find correct image
    let currentCondition = localStore.getItem("day0_description") == null ? "-" : localStore.getItem("day0_description")!;
    if (currentCondition.includes("clear")) {
    spriteX = config.iconMap.clear.x;
    } else if (currentCondition.includes("heavy") && currentCondition.includes("rain")) {
    spriteX = config.iconMap.heavyRain.x;
    } else if (currentCondition.includes("rain") && (currentCondition.includes("moderate") || currentCondition.includes("light"))) {
    spriteX = config.iconMap.lightRain.x;
    } else if (currentCondition.includes("cloud")) {
    spriteX = config.iconMap.partlyCloudy.x;
    } else if (currentCondition.includes("storm")) {
    spriteX = config.iconMap.storm.x;
    } else if (currentCondition.includes("rain")) {
    spriteX = config.iconMap.rain.x;
    }
    pic = new Picture({ x: objOptions.x * vw, y: objOptions.y * vh, w: objOptions.w * vw, h: objOptions.h * vh, imgSrc: config.iconMap.src,
                        sx: spriteX, sy: spriteY, sw: config.iconMap.width, sh: config.iconMap.height});
    }
    else {
    pic = new Picture({ x: objOptions.x * vw, y: objOptions.y * vh, w: objOptions.w * vw, h: objOptions.h * vh, imgSrc: objOptions.dataSrc});
    }
    return pic;
}

function loadText(objOptions: {
    type: string,
    x: number,
    y: number,
    w: number,
    h: number,
    dataSrc: string,
    args: {} }, vw: number, vh: number, textMsg: string): Label {

    let options = { x: objOptions.x * vw, y: objOptions.y *vh, w: objOptions.w * vw, h: objOptions.h * vh, text: textMsg};
    options = Object.assign(options, objOptions.args);
    return new Label(options); 
}

function loadView(orientation: "portrait" | "landscape", width: number, height: number): Canvas {
    let cnv = new Canvas(width, height);
    const vw = cnv.getCanvasProps().width / 100;
    const vh = cnv.getCanvasProps().height / 100;
    let rect: Rectangle;
    let orientationConfig:Object = config.landscape;
    if (orientation === "portrait") {
      orientationConfig = config.portrait;
    }
    for (let category of Object.values(orientationConfig)) {
      for(let [objID, objToRender_] of Object.entries(category)) {
        let objToRender = objToRender_ as {
          type: string,
          x: number,
          y: number,
          w: number,
          h: number,
          dataSrc: string,
          args: {}
        };
        if (objToRender.type === "text") {
          let textMsg = localStore.getItem(objToRender.dataSrc) || "-";
          cnv.add(objID, loadText(objToRender, vw, vh, textMsg));
          localStore.setItem(objToRender.dataSrc, textMsg, () => {
            cnv.updateItem(objID, {text: localStore.getItem(objToRender.dataSrc) || "-" });
            cnv.drawItem(objID);
          });
        }
        else if (objToRender.type === "rect") {
          let options = { x: objToRender.x * vw, y: objToRender.y *vh, w: objToRender.w * vw, h: objToRender.h * vh};
          options = Object.assign(options, objToRender.args);
          rect = new Rectangle(options);
          cnv.add(objID, rect);
        }
        else if (objToRender.type === "image") {
          cnv.add(objID, loadImg(objToRender, vw, vh));
        }
      }
    }
    return cnv;
  }

export async function refreshView(): Promise<void> {
    let newView: Canvas;
    cachedWidth = document.documentElement.clientWidth;
    if (document.documentElement.clientWidth > document.documentElement.clientHeight) { // Landscape view
      landscapeView = loadView("landscape", document.documentElement.clientWidth, document.documentElement.clientHeight);
      portraitView = loadView("portrait", document.documentElement.clientHeight, document.documentElement.clientWidth);
      newView = landscapeView;
    } else {  // Portrait view
      landscapeView = loadView("landscape", document.documentElement.clientHeight, document.documentElement.clientWidth);
      portraitView = loadView("portrait", document.documentElement.clientWidth, document.documentElement.clientHeight);
      newView = portraitView;
    }
    if (currentView != undefined) {
      document.getElementById("app")?.removeChild(await currentView.get());
    }
    currentView = newView;
    document.getElementById("app")?.appendChild(await currentView.get());
    //document.querySelector("canvas")?.classList.add("night");
    addEventListenerToCanvas();
  }

  export async function resize(): Promise<void> {
    if (document.documentElement.clientHeight == cachedWidth) {  // Change of orientation
        cachedWidth = document.documentElement.clientWidth;
        document.getElementById("app")?.removeChild(await currentView.get());
        if (currentView == portraitView) {
            currentView = landscapeView;
        } else {
            currentView = portraitView;
        }
        document.getElementById("app")?.appendChild(await currentView.get());
        addEventListenerToCanvas();   
    } else if (document.documentElement.clientWidth != cachedWidth) {    // Resize or change of resolution
        refreshView();
    }
}