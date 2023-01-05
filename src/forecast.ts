import { selfUpdatingText, selfUpdatingWidget, scaleFont, localStore, timeOutIds } from './utils';

export default async function forecast(context: CanvasRenderingContext2D, 
    width: number, height: number, day: number, coords = {x: 0, y: 0}) {
    let centre: number = coords.x + width / 2;
    let y: number = coords.y;
    // Paint the rectangles
    context.fillStyle = "rgba(68,114,196, 0.85)";
    if (width > height) {       // Portrait view
        context.fillRect(coords.x, y, width, height);
    } else {      
        context.fillRect(coords.x, y, width, height);
    }
    coords.x = coords.x + width * 0.03;     // margin
    // Day + date
    let futureDay = new Date();
    futureDay.setDate(new Date().getDate() + day);
    if ( width < height ) {     // Landscape view due to column layout the width is smaller than the height in this view
        let dayFormat = futureDay.toLocaleString('en-gb', { weekday: 'short'}).replaceAll(",","");
         // Short day
        let w = width * 0.34;
        let h = height *0.08;
        let x = centre - w/2;
        let dayShort = new selfUpdatingWidget(x,y,w,h);
        dayShort.updater = ()=>{
            context.clearRect(dayShort.x,dayShort.y,dayShort.w,dayShort.h);
            context.fillStyle = "rgba(68,114,196, 0.85)";
            context.fillRect(dayShort.x,dayShort.y,dayShort.w,dayShort.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let fontSize = scaleFont(localStore.get("day"+day.toString())!, dayShort.w, dayShort.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("day"+day.toString())!,dayShort.x,dayShort.y+fontSize+(dayShort.h-fontSize)/2);
        };
        localStore.set("day"+day.toString(),dayFormat,dayShort.updater);
        let tick = window.setInterval(()=>{
            let futureDay = new Date();
            futureDay.setDate(new Date().getDate() + day);
            let dayFormat = futureDay.toLocaleString('en-gb', { weekday: 'short'}).replaceAll(",","");
            localStore.update("day"+day.toString(),dayFormat);  
            dayFormat = futureDay.toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
            localStore.update("day"+day.toString()+"Date",dayFormat);          
        },3600000); // 1 hour
        timeOutIds.push(tick);
        y += h;
        // Date
        w = width * 0.5;
        h = height *0.08;
        x = centre - w/2;
        dayFormat = futureDay.toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
        let dayDate = new selfUpdatingWidget(x,y,w,h);
        dayDate.updater = ()=>{
            context.clearRect(dayDate.x,dayDate.y,dayDate.w,dayDate.h);
            context.fillStyle = "rgba(68,114,196, 0.85)";
            context.fillRect(dayDate.x,dayDate.y,dayDate.w,dayDate.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let fontSize = scaleFont(localStore.get("day"+day.toString()+"Date")!, dayDate.w, dayDate.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("day"+day.toString()+"Date")!,dayDate.x,dayDate.y+fontSize+(dayDate.h-fontSize)/2);
        };
        localStore.set("day"+day.toString()+"Date",dayFormat,dayDate.updater);
        y += h;
        // Temperature
        w = width * 0.4;
        h = height * 0.13;
        x = centre - w/2;
        let temp = new selfUpdatingWidget(x,y,w,h);
        temp.updater = ()=>{
            let marginX = scaleFont(localStore.get("temp")! + "°F", temp.w, temp.h)/2;
            context.clearRect(temp.x,temp.y,temp.w+marginX,temp.h);
            context.fillStyle = "rgba(68,114,196, 0.85)";
            context.fillRect(temp.x,temp.y,temp.w+marginX,temp.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let unit = localStorage.getItem("unit");
            let fontSize = scaleFont(localStore.get("tempDay"+day.toString())! + unit, temp.w, temp.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("tempDay"+day.toString())! + unit,temp.x,temp.y+fontSize+(temp.h-fontSize)/2);
        };
        let current = localStore.get("tempDay"+day.toString());
        if ( current == null ) {
            current = "-";
        }
        localStore.set("tempDay"+day.toString(),current,temp.updater);
        y += h;
        // Wind Icon & Text
        let imgWidth = 2 * scaleFont("14 km/h    ",width, h);
        let img = new Image();
        img.onload = ()=>{
            let scale = imgWidth / img.width
            let widthImg = imgWidth;
            let heightImg = img.height * scale;
            context.drawImage(img, coords.x, y, widthImg, heightImg);
            selfUpdatingText(context, "windDay"+day.toString(),coords.x+widthImg*1.1,y,width-widthImg*1.5,h);
            y += heightImg;
        }
        img.src = "/wind.png";
    } else {        // Portrait
        // Date
        let margin = height * 0.05;
        let dayFormat = futureDay.toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
        let w = width * 0.5;
        let h = height * 0.25;
        let x = coords.x;
        let dayDate = new selfUpdatingWidget(x,y,w,h);
        dayDate.updater = ()=>{
            context.clearRect(dayDate.x,dayDate.y,dayDate.w,dayDate.h);
            context.fillStyle = "rgba(68,114,196, 0.85)";
            context.fillRect(dayDate.x,dayDate.y,dayDate.w,dayDate.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let fontSize = scaleFont(localStore.get("day"+day.toString()+"Full")!, dayDate.w, dayDate.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("day"+day.toString()+"Full")!,dayDate.x,dayDate.y+fontSize+(dayDate.h-fontSize)/2);
        };
        localStore.set("day"+day.toString()+"Full",dayFormat,dayDate.updater);
        let tick = window.setInterval(()=>{
            let futureDay = new Date();
            futureDay.setDate(new Date().getDate() + day);
            let dayFormat = futureDay.toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
            localStore.update("day"+day.toString()+"Full",dayFormat);        
        },3600000); // 1 hour
        timeOutIds.push(tick);
        y += h + margin;
        // Temperature
        w = width * 0.35;
        h = height * 0.35;
        let temp = new selfUpdatingWidget(x,y,w,h);
        temp.updater = ()=>{
            let marginX = scaleFont(localStore.get("temp")! + "°F", temp.w, temp.h)/2;
            context.clearRect(temp.x,temp.y,temp.w+marginX,temp.h);
            context.fillStyle = "rgba(68,114,196, 0.85)";
            context.fillRect(temp.x,temp.y,temp.w+marginX,temp.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let unit = localStorage.getItem("unit");
            let fontSize = scaleFont(localStore.get("tempDay"+day.toString())! + unit, temp.w, temp.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("tempDay"+day.toString())! + unit,temp.x,temp.y+fontSize+(temp.h-fontSize)/2);
        };
        let current = localStore.get("tempDay"+day.toString());
        if ( current == null ) {
            current = "-";
        }
        localStore.set("tempDay"+day.toString(),current,temp.updater);
        y += h + margin;
        // Wind Icon & Text
        h = height / 4;
        let imgWidth = 2 * scaleFont("14 km/h    ",width, h);
        let img = new Image();
        img.onload = ()=>{
            let scale = imgWidth / img.width
            let widthImg = imgWidth;
            let heightImg = img.height * scale;
            context.drawImage(img, coords.x, y, widthImg, heightImg);
            selfUpdatingText(context, "windDay"+day.toString(),coords.x+widthImg*1.1,y,(width-widthImg)*0.25,h);
            y += heightImg;
        }
        img.src = "/wind.png";
    }
    return y;
}