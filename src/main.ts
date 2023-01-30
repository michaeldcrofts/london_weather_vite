import "./style.css";
import * as config from "./config.json";
import { Canvas, Label, Picture, Rectangle } from "./canvas";
import { localStore } from "./data";


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

function changeUnitInStorage(storageKey: string, unit: string): void {
  const regex = /[^\d\.\-]+/g;  // Regular Expression to strip any non-numeric characters
  let currentVal = localStore.getItem(storageKey);
  if ( currentVal != null && currentVal != "-" ) {
      currentVal = currentVal.replace(regex, "");
      currentVal = unit == "F" ? toF(Number(currentVal)).toString() + "°F" : toC(Number(currentVal)).toString() + "°C"
      localStore.setItem(storageKey, currentVal);
  } else{
      localStore.setItem(storageKey,"-");
  }
}

function fetchData(API_URL_: String): void {
  let API_URL = API_URL_ as unknown as URL;
  let timestamp: number = Number(localStore.getItem("timestamp"));
  if (Math.floor((Date.now() - timestamp) / 1000) >= config.updateInterval ) {      // Data is older than 15 minutes
      fetch(API_URL)
      .then(
          response => response.json()).then(data => {     // Promise returned good
              storeData(data);
      },
      () => { // Promise returned error
          let lastUpdateTime = "Error getting data, retrying...";
          localStore.setItem("lastUpdateTime", lastUpdateTime);
      });    
  }
}

function isNight(): boolean {    // A very crude function, returns true between 5pm and 7am
  let hour: number = new Date().getHours();
  return hour >= 17 || hour <= 6 ? true : false;
}

function loadView(orientation: "portrait" | "landscape", width: number, height: number): Canvas {
  let cnv = new Canvas(width, height);
  const vw = cnv.getCanvasProps().width / 100;
  const vh = cnv.getCanvasProps().height / 100;
  let txt: Label;
  let pic: Picture;
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
      if (objToRender["type"] === "text") {
        let textMsg = localStore.getItem(objToRender.dataSrc) || "-";
        let options = { x: objToRender.x * vw, y: objToRender.y *vh, w: objToRender.w * vw, h: objToRender.h * vh, text: textMsg};
        if (Object.hasOwn(objToRender, "args")) {
          options = Object.assign(options, objToRender.args);
        }
        txt = new Label(options);
        cnv.add(objID, txt);
        localStore.setItem(objToRender.dataSrc, textMsg, () => {
          cnv.updateItem(objID, {text: localStore.getItem(objToRender.dataSrc) || "-" });
          cnv.drawItem(objID);
        });
      }
      else if (objToRender.type === "rect") {
        let options = { x: objToRender.x * vw, y: objToRender.y *vh, w: objToRender.w * vw, h: objToRender.h * vh};
        if (Object.hasOwn(objToRender, "args")) {
          options = Object.assign(options, objToRender.args);
        }
        rect = new Rectangle(options);
        cnv.add(objID, rect);
      }
      else if (objToRender.type === "image") {
        if (objToRender.dataSrc === "iconMap") {
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
          pic = new Picture({ x: objToRender.x * vw, y: objToRender.y * vh, w: objToRender.w * vw, h: objToRender.h * vh, imgSrc: config.iconMap.src,
                                    sx: spriteX, sy: spriteY, sw: config.iconMap.width, sh: config.iconMap.height});
        }
        else {
          pic = new Picture({ x: objToRender.x * vw, y: objToRender.y * vh, w: objToRender.w * vw, h: objToRender.h * vh, imgSrc: objToRender.dataSrc});
        }
        cnv.add(objID, pic);
      }
    }
  }
  return cnv;
}

function storeData(data:any): void {
  let unit = localStore.getItem("unit");
  if ( unit == null ) {
      let currentTemp = localStore.getItem("day0_temperature");
      if ( currentTemp != null ) {
          if ( currentTemp.includes("°C") ) {
              unit = "°C";
          } else {
              unit = "°F";
          }
      } else {
          unit = "°C";
      }
      localStore.setItem("unit", unit);
  }
  // Process temperatures in desired unit
  const regex = /[^\d\.\-]+/g;
  let temperatureStrings: string[] = [data.temperature, data.forecast[0].temperature, data.forecast[1].temperature, data.forecast[2].temperature];
  for (let i = 0; i < temperatureStrings.length; i++) {
    temperatureStrings[i] = temperatureStrings[i].replace(regex, "");
    if (unit == "°F") {
      temperatureStrings[i] = toF(Number(temperatureStrings[i])).toString();
    }
    localStore.setItem("day" + i.toString() + "_temperature", temperatureStrings[i] + unit);
  }
  localStore.setItem("day0_description", data.description);
  localStore.setItem("day0_wind", data.wind);
  localStore.setItem("day1_wind", data.forecast[0].wind);
  localStore.setItem("day2_wind", data.forecast[1].wind);
  localStore.setItem("day3_wind", data.forecast[2].wind);

  localStore.setItem("timestamp", Date.now().toString());
  let lastUpdateTime = "Updated " + new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
  localStore.setItem("lastUpdateTime", lastUpdateTime);
}

async function refreshView(): Promise<void> {
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

function toF(cent: number): number {
  return Math.round(((cent * 9 / 5) + 32));
}
function toC(fah: number) : number {
  return fah == 0 ? 0 : Math.round((fah-32) / 1.8);
}

function toggleUnit(): void {
  // Enables the toggle between units. It stores the unit in localStorage to be retrieved by the temperature text widgets.
  let unit = localStore.getItem("unit");
  if ( unit == null ) {
      let currentTemp = localStore.getItem("temp");
      if ( currentTemp != null ) {
          if ( currentTemp.includes("°C") ) {
              unit = "°C";
          } else {
              unit = "°F";
          }
      } else {
          unit = "°C";
      }
  }
  if ( unit == "°C"){
    unit = "F";
  } else {
    unit = "C";
  }
  localStore.setItem("unit", "°" + unit);
  changeUnitInStorage("day0_temperature", unit);
  changeUnitInStorage("day1_temperature", unit);
  changeUnitInStorage("day2_temperature", unit);
  changeUnitInStorage("day3_temperature", unit);
}

function updateTimeStrings() {
  let day_time = new Date().toLocaleString('en-gb', { weekday: 'long', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
  let day_date_time = new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
  let date = new Date().toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
  localStore.setItem("day_date_time", day_date_time);
  localStore.setItem("day_time", day_time);
  localStore.setItem("date", date);

  for (let i = 1; i < 4; i++) {
    let futureDay = new Date();
    futureDay.setDate(new Date().getDate() + i);
    let short_day = futureDay.toLocaleString('en-gb', { weekday: 'short'}).replaceAll(",","");
    let date = futureDay.toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
    let day_date = futureDay.toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
    localStore.setItem("day" + i.toString() + "_day_date", day_date);
    localStore.setItem("day" + i.toString() + "_short_day", short_day);
    localStore.setItem("day" + i.toString() + "_date", date);
  }
}

window.onload = async () => {
  fetchData(config.API_URL);  // Query for data
  updateTimeStrings();
  localStore.setItem("location", config.location);
  refreshView();

  // Trigger a full refresh to the view if the description changes
  localStore.setItem("description", localStore.getItem("description") || "-", () => {
    refreshView();
  });

  window.setInterval( async () => {  // Look for new data and update the time every minute
    fetchData(config.API_URL);
    updateTimeStrings();    
  },10000);

  window.addEventListener('resize', async ()=>{
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
  }, true);
}