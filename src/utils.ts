import { localStore } from "./data";

export var iconMap = {          // x & y coordinates for a 'sprite-sheet' of icons
    clear: { x: 0, y: 0 },
    partlyCloudy: { x: 145, y: 0 },
    lightRain: { x: 290, y: 0 },
    rain: { x: 435, y: 0 },
    heavyRain: { x: 580, y: 0 },
    storm: { x: 725, y: 0 },
};

export function isNight(): boolean {    // A very crude function, returns true between 5pm and 7am
    let hour: number = new Date().getHours();
    return hour >= 17 || hour <= 6 ? true : false;
}

export function toF(cent: number): number {
    return Math.round(((cent * 9 / 5) + 32));
}
export function toC(fah: number) : number {
    return fah == 0 ? 0 : Math.round((fah-32) / 1.8);
}

export function toggleUnit(): void {
    // Enables the toggle between units. It stores the unit in localStorage to be retrieved by the temperature text widgets.
    // Because the data storage is bound to callbacks we only need to change the values stored.
    const regex = /[^\d\.\-]+/g;
    let unit = localStore.get("unit");
    if ( unit == null ) {
        let currentTemp = localStore.get("temp");
        if ( currentTemp != null ) {
            if ( currentTemp.includes("°C") ) {
                unit = "°C";
            } else {
                unit = "°F";
            }
        } else {
            unit = "°C";
        }
        localStore.set("unit", unit);
    } 
    if (unit == "°C") {
        localStore.set("unit", "°F");
        let currentTemp = localStore.get("temp");
        if ( currentTemp != null && currentTemp != "-" ) {
            currentTemp = currentTemp.replace(regex, "");
            localStore.update("temp", toF(Number(currentTemp)).toString() + "°F");
        } else{
            localStore.set("temp","-");
        }
        let tempDay1 = localStore.get("tempDay1");
        if ( tempDay1 != null && tempDay1 != "-" ) {
            tempDay1 = tempDay1.replace(regex, "");
            localStore.update("tempDay1", toF(Number(tempDay1)).toString() + "°F");
        } else{
            localStore.set("tempDay1","-");
        }
        let tempDay2 = localStore.get("tempDay2");
        if ( tempDay2 != null && tempDay2 != "-" ) {
            tempDay2 = tempDay2.replace(regex, "");
            localStore.update("tempDay2", toF(Number(tempDay2)).toString() + "°F");
        } else{
            localStore.set("tempDay2","-");
        }
        let tempDay3 = localStore.get("tempDay3");
        if ( tempDay3 != null && tempDay3 != "-" ) {
            tempDay3 = tempDay3.replace(regex, "");
            localStore.update("tempDay3", toF(Number(tempDay3)).toString() + "°F");
        } else{
            localStore.set("tempDay3","-");
        }
    }
    else {
        localStore.set("unit", "°C");
        let currentTemp = localStore.get("temp");
        if ( currentTemp != null && currentTemp != "-" ) {
            currentTemp = currentTemp.replace(regex, "");
            localStore.update("temp", toC(Number(currentTemp)).toString() + "°C");
        } else{
            localStore.set("temp","-");
        }
        let tempDay1 = localStore.get("tempDay1");
        if ( tempDay1 != null && tempDay1 != "-" ) {
            tempDay1 = tempDay1.replace(regex, "");
            localStore.update("tempDay1", toC(Number(tempDay1)).toString() + "°C");
        } else{
            localStore.set("tempDay1","-");
        }
        let tempDay2 = localStore.get("tempDay2");
        if ( tempDay2 != null && tempDay2 != "-" ) {
            tempDay2 = tempDay2.replace(regex, "");
            localStore.update("tempDay2", toC(Number(tempDay2)).toString() + "°C");
        } else{
            localStore.set("tempDay2","-");
        }
        let tempDay3 = localStore.get("tempDay3");
        if ( tempDay3 != null && tempDay3 != "-" ) {
            tempDay3 = tempDay3.replace(regex, "");
            localStore.update("tempDay3", toC(Number(tempDay3)).toString() + "°C");
        } else{
            localStore.set("tempDay3","-");
        }
    }
}

export function cancelTimeOuts(): void {  // Called when resizing the screen so to prevent widgets from updating during resize
    timeOutIds.forEach(id => {
        window.clearInterval(id);
    });
}

export var timeOutIds:number[] = [];    // Array of timeOutIds from window.setInterval so they can be cancelled at a later point.

  