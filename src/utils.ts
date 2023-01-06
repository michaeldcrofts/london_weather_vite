export var iconMap = {          // x & y coordinates for a 'sprite-sheet' of icons
    clear: { x: 0, y: 0 },
    partlyCloudy: { x: 145, y: 0 },
    lightRain: { x: 290, y: 0 },
    rain: { x: 435, y: 0 },
    heavyRain: { x: 580, y: 0 },
    storm: { x: 725, y: 0 },
};

export function isNight(): boolean {    // A very crude function, returns true between 6pm and midnight
    let hour: number = new Date().getHours();
    return hour >= 18 ? true : false;
}
export function getData() {             // Checks the timestamp stored in localStorage, if old it requests new data from the API and updates localStorage
    /*
    If the response from the API is in error a timeout is set to call itself again 0.5 seconds later. It will store the temperature data in the unit
    currently in view (F or C).
    */
    const API_URL: string = "https://goweather.herokuapp.com/weather/london";
    let timestamp: number = Number(localStore.get("timestamp"));
    //localStorage.removeItem("timestamp");
    if (Math.floor((Date.now() - timestamp) / 1000) >= 899 ) {      // Data is older than 15 minutes
        try {
            fetch(API_URL).then(
                response => response.json()).then(data => {     // Promise returned good
                    //data = JSON.parse('{"temperature":"0 °C","wind":"11 km/h","description":"Clear","forecast":[{"day":"1","temperature":"-2 °C","wind":"24 km/h"},{"day":"2","temperature":"10 °C","wind":"41 km/h"},{"day":"3","temperature":"+11 °C","wind":"28 km/h"}]}');
                    localStore.update("timestamp", Date.now().toString());
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
    // Returns the largest possible font-size to fit within width, although the calculation is a little crude it works for most use cases
    let fontSize = Math.floor(height);
    while (fontSize * text.length/2 > width) {
        fontSize -= 1;
    }
    return fontSize - 1;
}
export class localData {    
    // Class to manage localStorage, it gives the ability to add a callback when the data is changed, effectively enabling data binding to front-end UI elements
    #callbacks: Map<string, Array<CallableFunction>>;
    constructor(){
        this.#callbacks = new Map<string, Array<CallableFunction>>();
    }
    set(key: string, data: string, onChange: CallableFunction = ()=>{}) {
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
        if (localStorage.getItem(key) != data) {  // Only change the data and execute callbacks if it's different to what is already stored.
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
    // Used to store the coordinate and callback data for a 'widget'. It's deliberately vaguely defined for wide ranging application.
    // To-do: Use as a parent class for subclasses with specific functionality, such as Textbox or Image.
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

export function selfUpdatingText(context:CanvasRenderingContext2D, dataSrc:string, x:number, y: number, w: number, h: number) {
    // Creates an instance of selfUpdatingWidget to manage a textarea.
    // To-do: Turn this into a subclass of selfUpdatingWidget of Textbox. Enable the setting of a modifer to the string so that it can be used
    //        for temperature. Also setting of properties such as colour.
    let txt = new selfUpdatingWidget(x,y,w,h);
    txt.updater = ()=>{
        if (dataSrc.includes("wind") && dataSrc.includes("1") || dataSrc.includes("2") || dataSrc.includes("3")) { // Workaround to cope with a slight oversight for text draw on top of a filled area
            context.fillStyle = "rgba(68,114,196, 1)";
            context.fillRect(txt.x,txt.y,txt.w,txt.h);
        }
        else {
            context.clearRect(txt.x,txt.y,txt.w,txt.h);
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
    // Enables the toggle between units. It stores the unit in localStorage to be retrieved by the temperature text widgets.
    // Because the data storage is bound to callbacks we only need to change the values stored.
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

export function cancelTimeOuts() {  // Called when resizing the screen so to prevent widgets from updating during resize
    timeOutIds.forEach(id => {
        window.clearInterval(id);
    });
}

var centigrade: boolean = true;

export var timeOutIds:number[] = [];    // Array of timeOutIds from window.setInterval so they can be cancelled at a later point.
export var localStore = new localData();
  