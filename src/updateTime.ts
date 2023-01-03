export default async function updateTime(context: CanvasRenderingContext2D, width: number, height: number, coords = {x: 0, y: 0}) {
    let centre: number = coords.x + width / 2;
    let fontSize: number = height < width ? height * 0.03 : width * 0.03;
    let y: number = height - fontSize;
    context.font = fontSize + "px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    let timestamp: number = Number(window.localStorage.getItem("timestamp"));
    let today = "Updated "
    today += new Date(timestamp).toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
    context.fillText(today, centre, y);
}