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
    context.fillText("11°C", centre, y);
    fontSize = unit * 0.07;
    context.font = fontSize + "px Arial";
    y += fontSize + 5;
    context.fillText("Clear", centre, y);
    y += fontSize + 5;
    context.fillText("Wind: 17km/h", centre, y);
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
    let spriteY: number = 0;
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