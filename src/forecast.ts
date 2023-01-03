export default async function forecast(context: CanvasRenderingContext2D, 
    width: number, height: number, day: number, coords = {x: 0, y: 0}) {
    let centre: number = coords.x + width / 2;
    let y: number = coords.y;
    let fontSize: number = height * 0.06;
    if (fontSize * 9 > width) {
        fontSize = height * 0.05;
    }
    let heightUsed: number = (fontSize+5)*5;
    context.fillStyle = "rgba(68,114,196, 0.85)";
    if (width > height) {
        fontSize = width * 0.06;
        heightUsed = (fontSize+5)*4;
        context.fillRect(coords.x, y, width, heightUsed);
    } else {      
        context.fillRect(coords.x, y, width, height);
    }
    coords.x = coords.x + width * 0.03;
    let futureDay = new Date();
    futureDay.setDate(new Date().getDate() + day);
    context.font = fontSize + "px Arial";
    context.fillStyle = "white";
    if ( width < height ) {
        context.textAlign = "center";
        let dayFormat = futureDay.toLocaleString('en-gb', { weekday: 'long'}).replaceAll(",","");
        y += fontSize;
        context.fillText(dayFormat, centre, y);
        dayFormat = futureDay.toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
        y += fontSize + 5;
        context.fillText(dayFormat, centre, y);
        y += fontSize + 5;
        context.fillText("8°C", centre, y);
        y += fontSize + 5;
        let imgWidth = 2 * fontSize;
        let img = new Image();
        img.onload = ()=>{
            let scale = imgWidth / img.width
            let widthImg = imgWidth;
            let heightImg = img.height * scale;
            context.drawImage(img, centre - widthImg/2, y - heightImg/2 - 10, widthImg, heightImg);
            y += fontSize + 5;
            context.fillText("14 km/h", centre, y);
        }
        img.src = "/wind.png";
    } else {
        context.font = fontSize + "px Arial";
        context.textAlign = "left";
        let dayFormat = futureDay.toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
        y += fontSize + 5;
        context.fillText(dayFormat, coords.x, y);
        y += fontSize + 5;
        context.fillText("8°C", coords.x, y);
        y += fontSize + 5;
        let imgWidth = 2 * fontSize;
        let img = new Image();
        img.onload = ()=>{
            let scale = imgWidth / img.width
            let widthImg = imgWidth;
            let heightImg = img.height * scale;
            let x = coords.x;
            context.fillText("Wind: 14 km/h", x + 5 + widthImg, y);
            context.drawImage(img, x, y - heightImg/2 - 10, widthImg, heightImg);
        }
        img.src = "/wind.png";
    }
    return coords.y + heightUsed;
}