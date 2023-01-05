import {selfUpdatingWidget, scaleFont, localStore} from './utils'

export default async function updateTime(context: CanvasRenderingContext2D, width: number, height: number, coords = {x: 0, y: 0}) {
    let centre: number = coords.x + width / 2;
    let w = width
    let h = height * 0.04
    let x = centre - w/2;
    let y = coords.y;

    let updateT = new selfUpdatingWidget(x,y,w,h);
    updateT.updater = ()=>{
        let timestamp: number = Number(localStore.get("timestamp"));
        let today = "Updated ";
        today += new Date(timestamp).toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
        context.clearRect(updateT.x,updateT.y,updateT.w,updateT.h);
        context.fillStyle = "white";
        context.textAlign = "left";
        let fontSize = scaleFont(today, updateT.w, updateT.h);
        context.font = fontSize + "px Arial";
        context.fillText(today,updateT.x,updateT.y+fontSize+(updateT.h-fontSize)/2);
    };
    let current = localStore.get("timestamp");
    if ( current == null ) {
        current = "-";
    }
    localStore.set("timestamp",current,updateT.updater);
}

