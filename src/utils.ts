export var iconMap = {
    clear: { x: 0, y: 0 },
    partlyCloudy: { x: 145, y: 0 },
    lightRain: { x: 290, y: 0 },
    rain: { x: 435, y: 0 },
    heavyRain: { x: 580, y: 0 },
    storm: { x: 725, y: 0 },
};

export function isNight(): boolean {
    let hour: number = new Date().getHours();
    return hour >= 18 ? true : false;
}
export function getData() {
    const API_URL: string = "https://goweather.herokuapp.com/weather/london";   //"https://jsonplaceholder.typicode.com/todos/1"; // 
    let timestamp: number = Number(localStorage.getItem("timestamp"));
    //localStorage.removeItem("timestamp");
    if (Math.floor((Date.now() - timestamp) / 1000) >= 899 ) {
        console.log("Data older than 15 minutes");
        try {
            fetch(API_URL).then(
                response => response.json()).then(data => {
                    console.log("Fetched:", data);
                    //data = JSON.parse('{"temperature":"0 °C","wind":"11 km/h","description":"Clear","forecast":[{"day":"1","temperature":"-2 °C","wind":"24 km/h"},{"day":"2","temperature":"10 °C","wind":"41 km/h"},{"day":"3","temperature":"+11 °C","wind":"28 km/h"}]}');
                    localStorage.setItem("timestamp", Date.now().toString());
                    let currentTemp: string = data.temperature;
                    const regex = /[^\d\.\-]+/g;
                    let result: string = currentTemp.replace(regex, "");
                    if (localStorage.getItem("unit") == "°F"){
                        result = toF(Number(result)).toString();
                    }
                    localStore.update("temp", result);

                    currentTemp = data.forecast[0].temperature;
                    result = currentTemp.replace(regex, "");
                    if (localStorage.getItem("unit") == "°F"){
                        result = toF(Number(result)).toString();
                    }
                    localStore.update("tempDay1", result);

                    currentTemp = data.forecast[1].temperature;
                    result = currentTemp.replace(regex, "");
                    if (localStorage.getItem("unit") == "°F"){
                        result = toF(Number(result)).toString();
                    }
                    localStore.update("tempDay2", result);

                    currentTemp = data.forecast[2].temperature;
                    result = currentTemp.replace(regex, "");
                    if (localStorage.getItem("unit") == "°F"){
                        result = toF(Number(result)).toString();
                    }
                    localStore.update("tempDay3", result);

                    localStore.update("description", data.description);
                    localStore.update("wind", "Wind:" + data.wind);

                    localStore.update("windDay1", data.forecast[0].wind);
                    localStore.update("windDay2", data.forecast[1].wind);
                    localStore.update("windDay3", data.forecast[2].wind);
                },
                function() {
                    console.log("Promise returned error, retrying...");
                    window.setTimeout(getData, 500);
                }
            );
        } catch {
            console.log("Error retrieving URL");
            window.setTimeout(getData, 500);
        }
    }
}

export function scaleFont(text: string, width:number, height:number) {  
    // Returns the largest possible font-size to fit within width
    let fontSize = Math.floor(height);
    while (fontSize * text.length/2 > width) {
        fontSize -= 1;
    }
    return fontSize;
}
export class localData {
    #callbacks: Map<string, Array<CallableFunction>>;
    constructor(){
        this.#callbacks = new Map<string, Array<CallableFunction>>();
    }
    set(key: string, data: string, onChange: CallableFunction) {
        console.log("Setting", key);
        if (!this.#callbacks.has(key)) {
            this.#callbacks.set(key, []);
        }
        let fncs = this.#callbacks.get(key)!;
        fncs.push(onChange);
        this.#callbacks.set(key, fncs);
        localStorage.setItem(key, data);
        onChange();
    }
    get(key: string): string | null {
        return localStorage.getItem(key);
    }
    update(key: string, data: string) {
        if (localStorage.getItem(key) != data) {
            console.log("Updating", key, "to", data);
            localStorage.setItem(key, data);
            if (this.#callbacks.has(key)) {
                let fncs = this.#callbacks.get(key);
                fncs?.forEach((value)=>{
                    value();
                });
            }
        }        
    }
    remove(key: string) {
        if (this.#callbacks.has(key)) {
            this.#callbacks.delete(key);
        }
        localStorage.removeItem(key);
    }
    cancelCallbacks() {
        this.#callbacks = new Map<string, Array<CallableFunction>>();
    }
}

export class selfUpdatingWidget{
    x:number;
    y:number;
    w:number;
    h:number;
    updater: CallableFunction = ()=>{};
    constructor(x:number,y:number,w:number,h:number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

export function cancelTimeOuts() {
    timeOutIds.forEach(id => {
        window.clearInterval(id);
    });
}

export function selfUpdatingText(context:CanvasRenderingContext2D, dataSrc:string, x:number, y: number, w: number, h: number) {
    let txt = new selfUpdatingWidget(x,y,w,h);
    txt.updater = ()=>{
        let marginX = 1;
        let marginY = 1;
        context.clearRect(txt.x-marginX,txt.y-marginY,txt.w+marginX,txt.h+marginY);
        if (dataSrc.includes("wind") && dataSrc.includes("1") || dataSrc.includes("2") || dataSrc.includes("3")) { // Cope with a slight oversight
            context.fillStyle = "rgba(68,114,196, 0.85)";
            context.fillRect(txt.x,txt.y,txt.w,txt.h);
        }
        context.fillStyle = "white";
        context.textAlign = "left";
        let fontSize = scaleFont(localStore.get(dataSrc)!, txt.w, txt.h);
        context.font = fontSize + "px Arial";
        context.fillText(localStore.get(dataSrc)!,txt.x+(txt.w-fontSize*localStore.get(dataSrc)!.length/2)/2,txt.y+fontSize+(txt.h-fontSize)/2);
    };
    let current = localStore.get(dataSrc);
    if (current == null || current == "undefined") {
        current = "-";
    }
    localStore.set(dataSrc,current,txt.updater);
}

function toF(cent: number): number {
    return Math.round(((cent * 9 / 5) + 32));
}
function toC(fah: number) : number {
    return fah == 0 ? 0 : Math.round((fah-32) / 1.8);
}

export function toggleUnit() {
    if (centigrade) {
        localStorage.setItem("unit", "°F");
        centigrade = false;
        localStore.update("temp", toF(Number(localStore.get("temp"))).toString());
        localStore.update("tempDay1", toF(Number(localStore.get("tempDay1"))).toString());
        localStore.update("tempDay2", toF(Number(localStore.get("tempDay2"))).toString());
        localStore.update("tempDay3", toF(Number(localStore.get("tempDay3"))).toString());
        
    }
    else {
        localStorage.setItem("unit", "°C");
        centigrade = true;
        localStore.update("temp", toC(Number(localStore.get("temp"))).toString());
        localStore.update("tempDay1", toC(Number(localStore.get("tempDay1"))).toString());
        localStore.update("tempDay2", toC(Number(localStore.get("tempDay2"))).toString());
        localStore.update("tempDay3", toC(Number(localStore.get("tempDay3"))).toString());
    }
}

var centigrade: boolean = true;

export var timeOutIds:number[] = [];
export var localStore = new localData();
  