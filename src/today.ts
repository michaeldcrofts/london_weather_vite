import { iconMap, isNight, scaleFont, localStore, timeOutIds, selfUpdatingWidget, selfUpdatingText } from './utils'
export default async function today(context: CanvasRenderingContext2D, 
                                    width: number, height: number, coords = {x: 0, y: 0}) {
    let centre: number = coords.x + width / 2;
    let y: number = coords.y;
    context.fillStyle = "white";
    context.textAlign = "left";
    let unit = height > width ? height : width;
    if (height > width) {       // Landscape - in landscape view a greater proportion of height is given to this widget
        // Weekday + time
        let w = width*0.7;
        let h = height * 0.1;
        let x = centre - w/2;
        let today = new Date().toLocaleString('en-gb', { weekday: 'long', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
        let day = new selfUpdatingWidget(x,y,w,h);
        day.updater = ()=>{
            
            context.clearRect(day.x,day.y,day.w,day.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let fontSize = scaleFont(localStore.get("day")!, day.w, day.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("day")!,day.x,day.y+fontSize+(day.h-fontSize)/2);
        };
        localStore.set("day",today,day.updater);
        let tick = window.setInterval(()=>{
            let today = new Date().toLocaleString('en-gb', { weekday: 'long', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
            localStore.update("day",today);            
        },60000);
        timeOutIds.push(tick);
        // Date
        y += h;
        w = width*0.4;
        h = height * 0.08;
        x = centre - w/2;
        today = new Date().toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
        let date = new selfUpdatingWidget(x,y,w,h);
        date.updater = ()=>{
            context.clearRect(date.x,date.y,date.w,date.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let fontSize = scaleFont(localStore.get("date")!, date.w, date.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("date")!,date.x,date.y+fontSize+(date.h-fontSize)/2);
        };
        localStore.set("date",today,date.updater);
        let dateTick = window.setInterval(()=>{
            let today = new Date().toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
            if (today != localStore.get("date")) {
                localStore.update("date",today);
            }
        },60000);
        timeOutIds.push(dateTick);
        // Location
        y += h;
        w = width * 0.4;
        h = height / 12;
        x = centre - w/2;
        let fontSize = scaleFont("London", w, h);
        context.font = fontSize + "px Arial";
        context.fillText("London",x,y+fontSize+(h-fontSize)/2);
        // Temperature
        y += h;
        w = width * 0.2;
        h = height / 10;
        x = centre - w/2;
        let temp = new selfUpdatingWidget(x,y,w,h);
        temp.updater = ()=>{
            let marginX = scaleFont(localStore.get("temp")! + "°F", temp.w, temp.h)/2;
            context.clearRect(temp.x,temp.y,temp.w+marginX,temp.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let unit = localStorage.getItem("unit");
            let fontSize = scaleFont(localStore.get("temp")! + unit, temp.w, temp.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("temp")! + unit,temp.x,temp.y+fontSize+(temp.h-fontSize)/2);
        };
        let current = localStore.get("temp");
        if ( current == null ) {
            current = "-";
        }
        localStore.set("temp",current,temp.updater);
        y += h;
        // Current condition
        w = width * 0.5;
        h = height * 0.11;
        x = centre - w/2;
        selfUpdatingText(context, "description",x,y,w,h);        
        y += h;
        // Wind
        selfUpdatingText(context, "wind",x,y,w,h);
        y += h;
    }
    else {              // Portrait
        // Day + Time
        let today = new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
        let w = width*0.61;
        let h = height / 6;
        let x = centre - w/2;
        let time = new selfUpdatingWidget(x,y,w,h);
        time.updater = ()=>{
            context.clearRect(time.x,time.y,time.w,time.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let fontSize = scaleFont(localStore.get("time")!, time.w, time.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("time")!,time.x,time.y+fontSize+(time.h-fontSize)/2);
        };
        localStore.set("time",today,time.updater);
        let tick = window.setInterval(()=>{
            let today = new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
            localStore.update("time",today);            
        },60000);
        timeOutIds.push(tick);
        // Location
        y += h;
        w = width * 0.3;
        h = height / 6;
        x = centre - w/2;
        let fontSize = scaleFont("London", w, h);
        context.font = fontSize + "px Arial";
        context.fillText("London",x,y+fontSize+(h-fontSize)/2);
        // Temperature
        y += h;
        w = width * 0.15;
        h = height / 6;
        x = centre - w/2;
        let temp = new selfUpdatingWidget(x,y,w,h);
        temp.updater = ()=>{
            let marginX = scaleFont(localStore.get("temp")! + "°F", temp.w, temp.h)/2;
            context.clearRect(temp.x,temp.y,temp.w+marginX,temp.h);
            context.fillStyle = "white";
            context.textAlign = "left";
            let unit = localStorage.getItem("unit");
            let fontSize = scaleFont(localStore.get("temp")! + unit, temp.w, temp.h);
            context.font = fontSize + "px Arial";
            context.fillText(localStore.get("temp")! + unit,temp.x,temp.y+fontSize+(temp.h-fontSize)/2);
        };
        let current = localStore.get("temp");
        if ( current == null ) {
            current = "-";
        }
        localStore.set("temp",current,temp.updater);
        y += h;
        // Current condition
        w = width * 0.4;
        h = height / 6;
        x = centre - w/2;
        selfUpdatingText(context, "description",x,y,w,h);
        y += h;
        // Wind
        w = width * 0.35;
        h = height / 6;
        x = centre - w/2;
        selfUpdatingText(context, "wind",x,y,w,h);
        y += h;
    }
    y += height * 0.03;
    // White line
    context.moveTo(coords.x,y);
    context.strokeStyle = "white";
    context.lineWidth = width * 0.01;
    context.lineTo(width, y);
    context.stroke();
    y += context.lineWidth * 3;
    let imgWidth: number = unit * 0.25;
    let x: number;
    let w: number = imgWidth;
    let h: number = w;
    let imgY = y;
            if (width < height) {
                x = centre-w/2;
            } else {
                x = coords.x+unit*0.05
                imgY = coords.y + y/2 - h/2
            }
            let imageIcon = new selfUpdatingWidget(x,imgY,imgWidth,h);
            imageIcon.updater = ()=>{                
                let spriteX: number = 0;
                let spriteY: number = isNight() ? 290 : 0;
                // Find correct image
                let currentCondition = localStore.get("description")!
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
            let current = localStore.get("description");
            if ( current == null ) {
                current = "-";
            }
            localStore.set("description",current,imageIcon.updater);
    return Math.ceil(y);
}