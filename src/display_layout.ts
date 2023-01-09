import CanvasContainer from "./canvas";
import { isNight, iconMap } from "./utils";
import { SelfUpdatingWidget, Textbox } from "./databound_widgets"
import { localStore } from "./data";
/* A Map for the layout of portrait and landscape views to be read by the CanvasContainer. Each canvas element has a render.... function to draw itself
   which are then in turn called by the CanvasContainer. Each render...functions takes as arguments the x, y, width, and height measured in
   CSS vw and vh units.
*/
export var portrait = new Map([
    // Today
    [renderDayDateTime,     {x: 0,  y: 0,    w: 100, h: 5}],
    [renderLocation,        {x: 0,  y: 5.5,  w: 100, h: 6}],
    [renderDescriptionImg,  {x: 5,  y: 6.5,  w: 28,  h: 28}],
    [renderTodayTemp,       {x: 34, y: 12,   w: 32,  h: 8}],
    [renderTodayDescription,{x: 0,  y: 20.5, w: 100, h: 6}],
    [renderTodayWindImg,    {x: 30, y: 27,   w: 15,  h: 4.5}],
    [renderTodayWind,       {x: 47, y: 27,   w: 23,  h: 5}],
    [renderWhiteLine,       {x: 0,  y: 33,   w: 100, h: 0.5}],
    // Day 1
    [renderDay1BgRect,      {x: 1,  y: 34.5, w: 98,  h: 15.5}],
    [renderDay1DayDate,     {x: 1,  y: 35,   w: 98,  h: 4.5}],
    [renderDay1Temp,        {x: 1,  y: 40,   w: 98,  h: 4.5}],
    [renderDay1WindImg,     {x: 1,  y: 45,   w: 15,  h: 4.5}],
    [renderDay1Wind,        {x: 18, y: 45,   w: 81,  h: 4.5}],
    // Day 2
    [renderDay2BgRect,      {x: 1,  y: 52.5, w: 98,  h: 15.5}],
    [renderDay2DayDate,     {x: 1,  y: 53,   w: 98,  h: 4.5}],
    [renderDay2Temp,        {x: 1,  y: 58,   w: 98,  h: 4.5}],
    [renderDay2WindImg,     {x: 1,  y: 63,   w: 15,  h: 4.5}],
    [renderDay2Wind,        {x: 18, y: 63,   w: 81,  h: 4.5}],
    // Day 3
    [renderDay3BgRect,      {x: 1,  y: 70.5, w: 98,  h: 15.5}],
    [renderDay3DayDate,     {x: 1,  y: 71,   w: 98,  h: 4.5}],
    [renderDay3Temp,        {x: 1,  y: 76,   w: 98,  h: 4.5}],
    [renderDay3WindImg,     {x: 1,  y: 81,   w: 15,  h: 4.5}],
    [renderDay3Wind,        {x: 18, y: 81,   w: 81,  h: 4.5}],
    
    [renderUpdateTime,      {x: 0,  y: 96,   w: 100, h: 4}],
]);

export var landscape = new Map([
    // Today
    [renderDayTime,         {x: 0, y: 0,    w: 35, h: 10}],
    [renderDate,            {x: 0, y: 10.5, w: 35, h: 8}],
    [renderLocation,        {x: 0, y: 19,   w: 35, h: 10}],
    [renderTodayTemp,       {x: 0, y: 29.5, w: 35, h: 12}],
    [renderTodayDescription,{x: 0, y: 42,   w: 35, h: 10}],
    [renderTodayWind,       {x: 0, y: 52.5, w: 35, h: 8}],
    [renderDescriptionImg,  {x:10, y: 64,   w: 14, h: 14}],
    //[renderWhiteLine,       {x: 0, y: 30, w: 100, h: 0.5}],
    // Day 1
    [renderDay1BgRect,      {x:37, y: 0,    w: 19, h: 100}],
    [renderDay1Day,         {x:37, y: 0,    w: 19, h: 10}],
    [renderDay1Date,        {x:37, y: 10.5, w: 19, h: 8}],
    [renderDay1Temp,        {x:37, y: 19,   w: 19, h: 10}],
    [renderDay1WindImg,     {x:37, y: 31,   w: 6,  h: 8}],
    [renderDay1Wind,        {x:44, y: 29.5, w: 12, h: 8}],
    // Day 2
    [renderDay2BgRect,      {x:58, y: 0,    w: 19, h: 100}],
    [renderDay2Day,         {x:58, y: 0,    w: 19, h: 10}],
    [renderDay2Date,        {x:58, y: 10.5, w: 19, h: 8}],
    [renderDay2Temp,        {x:58, y: 19,   w: 19, h: 10}],
    [renderDay2WindImg,     {x:58, y: 31,   w: 6,  h: 8}],
    [renderDay2Wind,        {x:65, y: 29.5, w: 12, h: 8}],
    // Day 3
    [renderDay3BgRect,      {x:79, y: 0,    w: 19, h: 100}],
    [renderDay3BgRect,      {x:79, y: 0,    w: 19, h: 100}],
    [renderDay3Day,         {x:79, y: 0,    w: 19, h: 10}],
    [renderDay3Date,        {x:79, y: 10.5, w: 19, h: 8}],
    [renderDay3Temp,        {x:79, y: 19,   w: 19, h: 10}],
    [renderDay3WindImg,     {x:79, y: 31,   w: 6,  h: 8}],
    [renderDay3Wind,        {x:86, y: 29.5, w: 12, h: 8}],

    [renderUpdateTime,      {x: 0, y: 94,   w: 34,  h: 6}],
]);

export function renderDayDateTime(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let dayDateTime = localStore.get("day_date_time") == null ? "-" : localStore.get("day_date_time");
    let timeTxt = new Textbox({context: context, text: dayDateTime!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, dataBindSrc:"day_date_time"});
    options.canvasContainer.add("timeTxt", timeTxt);
    timeTxt.draw();
}

export function renderDayTime(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let dayTime = localStore.get("day_time") == null ? "-" : localStore.get("day_time");
    let timeTxt = new Textbox({context: context, text: dayTime!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, dataBindSrc:"day_time"});
    options.canvasContainer.add("timeTxt", timeTxt);
    timeTxt.draw();
}

export function renderDate(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let date = localStore.get("date") == null ? "-" : localStore.get("date");
    let dateTxt = new Textbox({context: context, text: date!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, dataBindSrc:"date"});
    options.canvasContainer.add("date", dateTxt);
    dateTxt.draw();
}

export function renderUpdateTime(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let lastUpdateTime = localStore.get("lastUpdateTime") == null ? "-" : localStore.get("lastUpdateTime");
    let lastUpdateTimeTxt = new Textbox({context: context, text: lastUpdateTime!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, dataBindSrc:"lastUpdateTime"});
    options.canvasContainer.add("lastUpdateTime", lastUpdateTimeTxt);
    lastUpdateTimeTxt.draw();
}

export function renderLocation(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let locationTxt = new Textbox({context: context, text: "London", x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh});
    options.canvasContainer.add("locationTxt", locationTxt);
    locationTxt.draw();
}

export function renderTodayTemp(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let todayTemp = localStore.get("temp") == null ? "-" : localStore.get("temp");
    let todayTempTxt = new Textbox({context: context, text: todayTemp!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, dataBindSrc:"temp"});
    options.canvasContainer.add("todayTempTxt", todayTempTxt);
    todayTempTxt.draw();

}

export function renderTodayDescription(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let todayDescription = localStore.get("description") == null ? "-" : localStore.get("description");
    var todayDescriptionTxt = new Textbox({context: context, text: todayDescription!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, dataBindSrc:"description"});
    options.canvasContainer.add("todayDescriptionTxt", todayDescriptionTxt);
    todayDescriptionTxt.draw();
}

export function renderTodayWind(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let todayWind = localStore.get("wind") == null ? "-" : localStore.get("wind");
    let todayWindTxt = new Textbox({context: context, text: todayWind!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, dataBindSrc:"wind"});
    options.canvasContainer.add("todayWindTxt", todayWindTxt);
    todayWindTxt.draw();
}

export function renderWhiteLine(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    context.moveTo(options.x * vw, options.y * vh);
    context.strokeStyle = "white";
    context.lineWidth = vh * options.h;
    context.lineTo(options.x * vw + options.w * vw, options.y * vh);
    context.stroke();
}

export function renderDescriptionImg(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let todayDescription = localStore.get("description") == null ? "-" : localStore.get("description");
    if ( options.canvasContainer.canvas.width < options.canvasContainer.canvas.height ) {   // Portrait
        // Find edge of description text
        let todayDescriptionTxt = options.canvasContainer.objects.get("todayDescriptionTxt");
        if ( todayDescriptionTxt instanceof Textbox ) {
            let descriptionX = todayDescriptionTxt.x + (todayDescriptionTxt.w - todayDescriptionTxt.txtWidth) / 2;
            if ( options.x * vw + options.w * vw > descriptionX ) { // Ensure no overlap
                options.w = descriptionX / vw - options.x;
            }
        }
        // Find edge of temperature text
        let todayTempTxt = options.canvasContainer.objects.get("todayTempTxt");
        if ( todayTempTxt instanceof Textbox ) {
            let tempX = todayTempTxt.x + (todayTempTxt.w - todayTempTxt.txtWidth) / 2;
            if ( options.x * vw + options.w * vw > tempX ) { // Ensure no overlap
                options.w = tempX / vw - options.x;
            }
        }
        // Find edge of Location text
        let locationTxt = options.canvasContainer.objects.get("locationTxt");
        if ( locationTxt instanceof Textbox ) {
            let locationX = locationTxt.x + (locationTxt.w - locationTxt.txtWidth) / 2;
            if ( options.x * vw + options.w * vw > locationX ) { // Ensure no overlap
                options.w = locationX / vw - options.x;
            }
        }
    } 
    // Image icon, uses the selfUpdatingWidget class to manage updates. Binds to the 'description' data store
    let imageIcon = new SelfUpdatingWidget(options.x * vw,options.y * vh,options.w * vw,options.h * vh);
    imageIcon.updater = ()=>{                
        let spriteX: number = 0;
        let spriteY: number = isNight() ? 290 : 0;
        // Find correct image
        let currentCondition = localStore.get("description") == null ? "-" : localStore.get("description")!;
        if (currentCondition.includes("clear")) {
            spriteX = iconMap.clear.x;
        } else if (currentCondition.includes("heavy") && currentCondition.includes("rain")) {
            spriteX = iconMap.heavyRain.x;
        } else if (currentCondition.includes("rain") && (currentCondition.includes("moderate") || currentCondition.includes("light"))) {
            spriteX = iconMap.lightRain.x;
        } else if (currentCondition.includes("cloud")) {
            spriteX = iconMap.partlyCloudy.x;
        } else if (currentCondition.includes("storm")) {
            spriteX = iconMap.storm.x;
        } else if (currentCondition.includes("rain")) {
            spriteX = iconMap.rain.x;
        }
        context.clearRect(imageIcon.x,imageIcon.y,imageIcon.w,imageIcon.w);
        let img = new Image();
        img.onload = ()=>{
            Promise.all([
                createImageBitmap(img, spriteX, spriteY, 120, 120)
            ]).then((icon) => {
                let scale = imageIcon.w / icon[0].width;
                let widthImg = imageIcon.w;
                let heightImg = icon[0].height * scale;
                context.drawImage(icon[0], imageIcon.x, imageIcon.y, widthImg, heightImg);
            }); 
        }
        img.src = "/icons.png";     
    };
    let cssClass = localStore.get("cssClass");
    if ( cssClass == null ) {
        cssClass = isNight() ? "night" : "day";
    }
    localStore.set("description",todayDescription!,imageIcon.updater);  // Bind to the description data source
    localStore.set("cssClass",cssClass,imageIcon.updater);  // Bind to the cssClass for changing of image when daytime/nightime changes.
    
    options.canvasContainer.add("DescriptionImg", imageIcon);
} 

export function renderDay1BgRect(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    context.fillStyle = "rgba(68,114,196, 1)";
    context.fillRect(options.x * vw, options.y * vh, options.w * vw, options.h * vh);
}

export function renderDay2BgRect(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    context.fillStyle = "rgba(68,114,196, 1)";
    context.fillRect(options.x * vw, options.y * vh, options.w * vw, options.h * vh);
}

export function renderDay3BgRect(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    context.fillStyle = "rgba(68,114,196, 1)";
    context.fillRect(options.x * vw, options.y * vh, options.w * vw, options.h * vh);
}

export function renderDay1DayDate(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let dayDate = localStore.get("day1_day_date") == null ? "-" : localStore.get("day1_day_date");
    let day1DayDateTxt = new Textbox({context: context, text: dayDate!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"day1_day_date", bgColor: "rgba(68,114,196, 1)", align: "left"});
    options.canvasContainer.add("day1DayDateTxt", day1DayDateTxt);
    day1DayDateTxt.draw();
}

export function renderDay2DayDate(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let dayDate = localStore.get("day2_day_date") == null ? "-" : localStore.get("day2_day_date");
    let day2DayDateTxt = new Textbox({context: context, text: dayDate!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"day2_day_date", bgColor: "rgba(68,114,196, 1)", align: "left"});
    options.canvasContainer.add("day2DayDateTxt", day2DayDateTxt);
    day2DayDateTxt.draw();
}

export function renderDay3DayDate(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let dayDate = localStore.get("day3_day_date") == null ? "-" : localStore.get("day3_day_date");
    let day3DayDateTxt = new Textbox({context: context, text: dayDate!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"day3_day_date", bgColor: "rgba(68,114,196, 1)", align: "left"});
    options.canvasContainer.add("day3DayDateTxt", day3DayDateTxt);
    day3DayDateTxt.draw();
}

export function renderDay1Temp(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day1Temp = localStore.get("tempDay1") == null ? "-" : localStore.get("tempDay1");
    let align = "center";
    if ( options.canvasContainer.canvas.width < options.canvasContainer.canvas.height ) {   // Portrait
        align = "left";
    }
    let day1TempTxt = new Textbox({context: context, text: day1Temp!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"tempDay1", bgColor: "rgba(68,114,196, 1)", align: align});
    options.canvasContainer.add("tempDay1", day1TempTxt);
    day1TempTxt.draw();
}

export function renderDay2Temp(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day2Temp = localStore.get("tempDay2") == null ? "-" : localStore.get("tempDay2");
    let align = "center";
    if ( options.canvasContainer.canvas.width < options.canvasContainer.canvas.height ) {   // Portrait
        align = "left";
    }
    let day2TempTxt = new Textbox({context: context, text: day2Temp!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"tempDay2", bgColor: "rgba(68,114,196, 1)", align: align});
    options.canvasContainer.add("tempDay2", day2TempTxt);
    day2TempTxt.draw();
}

export function renderDay3Temp(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day3Temp = localStore.get("tempDay3") == null ? "-" : localStore.get("tempDay3");
    let align = "center";
    if ( options.canvasContainer.canvas.width < options.canvasContainer.canvas.height ) {   // Portrait
        align = "left";
    }
    let day3TempTxt = new Textbox({context: context, text: day3Temp!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"tempDay3", bgColor: "rgba(68,114,196, 1)", align: align});
    options.canvasContainer.add("tempDay3", day3TempTxt);
    day3TempTxt.draw();
}

export function renderTodayWindImg(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let img = new Image();
    img.onload = ()=>{
        let scale = (options.w * vw) / img.width
        let widthImg = options.w * vw;
        let heightImg = img.height * scale;
        context.drawImage(img, options.x * vw, options.y * vh, widthImg, heightImg);
    }
    img.src = "/wind.png";
}

export function renderDay1WindImg(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let img = new Image();
    img.onload = ()=>{
        let scale = (options.w * vw) / img.width
        let widthImg = options.w * vw;
        let heightImg = img.height * scale;
        context.drawImage(img, options.x * vw, options.y * vh, widthImg, heightImg);
    }
    img.src = "/wind.png";
}

export function renderDay2WindImg(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let img = new Image();
    img.onload = ()=>{
        let scale = (options.w * vw) / img.width
        let widthImg = options.w * vw;
        let heightImg = img.height * scale;
        context.drawImage(img, options.x * vw, options.y * vh, widthImg, heightImg);
    }
    img.src = "/wind.png";
}

export function renderDay3WindImg(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let img = new Image();
    img.onload = ()=>{
        let scale = (options.w * vw) / img.width
        let widthImg = options.w * vw;
        let heightImg = img.height * scale;
        context.drawImage(img, options.x * vw, options.y * vh, widthImg, heightImg);
    }
    img.src = "/wind.png";
}

export function renderDay1Wind(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day1Wind = localStore.get("windDay1") == null ? "-" : localStore.get("windDay1");
    let day1WindTxt = new Textbox({context: context, text: day1Wind!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"windDay1", bgColor: "rgba(68,114,196, 1)", align: "left"});
    options.canvasContainer.add("day1Wind", day1WindTxt);
    day1WindTxt.draw();
}

export function renderDay2Wind(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day2Wind = localStore.get("windDay2") == null ? "-" : localStore.get("windDay2");
    let day2WindTxt = new Textbox({context: context, text: day2Wind!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"windDay2", bgColor: "rgba(68,114,196, 1)", align: "left"});
    options.canvasContainer.add("day2Wind", day2WindTxt);
    day2WindTxt.draw();
}

export function renderDay3Wind(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day3Wind = localStore.get("windDay3") == null ? "-" : localStore.get("windDay3");
    let day3WindTxt = new Textbox({context: context, text: day3Wind!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"windDay2", bgColor: "rgba(68,114,196, 1)", align: "left"});
    options.canvasContainer.add("day3Wind", day3WindTxt);
    day3WindTxt.draw();
}

export function renderDay1Day(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day1Day = localStore.get("day1_short_day") == null ? "-" : localStore.get("day1_short_day");
    let day1DayTxt = new Textbox({context: context, text: day1Day!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"day1_short_day", bgColor: "rgba(68,114,196, 1)", align: "center"});
    options.canvasContainer.add("day1_short_day", day1DayTxt);
    day1DayTxt.draw();
}

export function renderDay2Day(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day2Day = localStore.get("day2_short_day") == null ? "-" : localStore.get("day2_short_day");
    let day2DayTxt = new Textbox({context: context, text: day2Day!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"day2_short_day", bgColor: "rgba(68,114,196, 1)", align: "center"});
    options.canvasContainer.add("day2_short_day", day2DayTxt);
    day2DayTxt.draw();
}

export function renderDay3Day(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day3Day = localStore.get("day3_short_day") == null ? "-" : localStore.get("day3_short_day");
    let day3DayTxt = new Textbox({context: context, text: day3Day!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                     dataBindSrc:"day3_short_day", bgColor: "rgba(68,114,196, 1)", align: "center"});
    options.canvasContainer.add("day3_short_day", day3DayTxt);
    day3DayTxt.draw();
}

export function renderDay1Date(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day1Date = localStore.get("day1_date") == null ? "-" : localStore.get("day1_date");
    let day1DateTxt = new Textbox({context: context, text: day1Date!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                   dataBindSrc:"day1_date", bgColor: "rgba(68,114,196, 1)", align: "center"});
    options.canvasContainer.add("day1DateTxt", day1DateTxt);
    day1DateTxt.draw();
}

export function renderDay2Date(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day2Date = localStore.get("day2_date") == null ? "-" : localStore.get("day2_date");
    let day2DateTxt = new Textbox({context: context, text: day2Date!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                   dataBindSrc:"day2_date", bgColor: "rgba(68,114,196, 1)", align: "center"});
    options.canvasContainer.add("day2DateTxt", day2DateTxt);
    day2DateTxt.draw();
}

export function renderDay3Date(options: {canvasContainer: CanvasContainer, x: number, y: number, w: number, h: number}): void {
    let context = options.canvasContainer.context;
    let vw = options.canvasContainer.vw;
    let vh = options.canvasContainer.vh;
    let day3Date = localStore.get("day3_date") == null ? "-" : localStore.get("day3_date");
    let day3DateTxt = new Textbox({context: context, text: day3Date!, x: options.x * vw, y: options.y * vh, w: options.w * vw, h:options.h * vh, 
                                   dataBindSrc:"day3_date", bgColor: "rgba(68,114,196, 1)", align: "center"});
    options.canvasContainer.add("day3DateTxt", day3DateTxt);
    day3DateTxt.draw();
}