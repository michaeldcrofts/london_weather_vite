import { iconMap, isNight } from './utils'
export default async function today(context: CanvasRenderingContext2D, 
                                    width: number, height: number, coords = {x: 0, y: 0}) {
    let centre: number = coords.x + width / 2;
    let y: number = coords.y;
    let unit: number = height > width ? height : width;
    let heightUsed: number = unit * 0.05 + 5 + unit * 0.07 + 5 + unit * 0.1 + 5 + unit * 0.07 + 5 + unit * 0.07 + 5 + (unit * 0.7)/2 + 5;
    if (heightUsed < height) {
        y += Math.floor((height - heightUsed) / 2);
    }
    let today = new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
    let fontSize: number = unit * 0.05;
    context.font = fontSize + "px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    y += fontSize;
    if (height > width) {
        today = new Date().toLocaleString('en-gb', { weekday: 'long'}).replaceAll(",","");
        context.fillText(today, centre, y);
        y += fontSize + 5;
        today = new Date().toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
        context.fillText(today, centre, y)
    }
    else {
        context.fillText(today, centre, y);
    }
    fontSize = unit * 0.07;
    context.font = fontSize + "px Arial";
    y += fontSize + 5;
    context.fillText("London", centre, y);
    fontSize = unit * 0.1;
    context.font = fontSize + "px Arial";
    y += fontSize + 5;
    let currentTemp: string = window.localStorage.getItem("temperature") || "-";
    let regex = /[^\d\.\-]+/g;
    let result: number = Number(currentTemp.replace(regex, ""));
    context.fillText(result.toString() + "°C", centre, y);
    fontSize = unit * 0.07;
    context.font = fontSize + "px Arial";
    y += fontSize + 5;
    let currentCondition: string;
    window.localStorage.getItem("description") == "undefined" ? currentCondition = "-" : currentCondition = window.localStorage.getItem("description")!;
    context.fillText(currentCondition, centre, y);
    y += fontSize + 5;
    let wind: string;
    window.localStorage.getItem("wind") == "undefined" ? wind = "-" : wind = window.localStorage.getItem("wind")!;
    context.fillText("Wind: " + wind, centre, y);
    y += fontSize / 2;
    context.moveTo(coords.x,y);
    context.strokeStyle = "white";
    context.lineWidth = width * 0.01;
    context.lineTo(width, y);
    context.stroke();
    y += context.lineWidth + 5;
    let imgWidth: number = unit * 0.25;
    let img = new Image();
    let spriteX: number = 0;
    let spriteY: number = isNight() ? 290 : 0;
    // Find correct image
    currentCondition = currentCondition.toLowerCase();
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
    img.onload = ()=>{
        Promise.all([
            createImageBitmap(img, spriteX, spriteY, 120, 120)
        ]).then((icon) => {
            let scale = imgWidth / icon[0].width;
            let widthImg = imgWidth;
            let heightImg = icon[0].height * scale;
            if (width < height) {
                context.drawImage(icon[0], centre-widthImg/2, y, widthImg, heightImg);
            } else {
                context.drawImage(icon[0], coords.x+unit*0.05, coords.y + y/2 - heightImg/2, widthImg, heightImg);
            }
        }); 
    }
    img.src = "/icons.png";
    return Math.ceil(y);
}