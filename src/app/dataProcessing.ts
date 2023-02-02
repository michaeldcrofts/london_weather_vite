import { localStore } from "../data";
import * as config from "../config.json";

function changeUnitInStorage(storageKey: string, unit: string): void {
    const regex = /[^\d\.\-]+/g;  // Regular Expression to strip any non-numeric characters
    let currentVal = localStore.getItem(storageKey);
    if ( currentVal != null && currentVal != "-" ) {
        currentVal = currentVal.replace(regex, "");
        currentVal = unit == "F" ? toF(Number(currentVal)).toString() + "°F" : toC(Number(currentVal)).toString() + "°C"
        localStore.setItem(storageKey, currentVal);
    } else{
        localStore.setItem(storageKey,"-");
    }
  }

export function fetchData(API_URL_: String): void {
    let API_URL = API_URL_ as unknown as URL;
    let timestamp: number = Number(localStore.getItem("timestamp"));
    if (Math.floor((Date.now() - timestamp) / 1000) >= config.updateInterval ) {      // Data is older than 15 minutes
        fetch(API_URL)
        .then(
            response => response.json()).then(data => {     // Promise returned good
                storeData(data);
        },
        () => { // Promise returned error
            let lastUpdateTime = "Error getting data, retrying...";
            localStore.setItem("lastUpdateTime", lastUpdateTime);
        });    
    }
  }

function processTemperatureStrings(temperatureStrings: string[]): string[] {
    let unit = localStore.getItem("unit");
    if ( unit == null ) {
        let currentTemp = localStore.getItem("day0_temperature");
        if ( currentTemp != null ) {
            if ( currentTemp.includes("°C") ) {
                unit = "°C";
            } else {
                unit = "°F";
            }
        } else {
            unit = "°C";
        }
        localStore.setItem("unit", unit);
    }
    const regex = /[^\d\.\-]+/g;
    for (let i = 0; i < temperatureStrings.length; i++) {
      temperatureStrings[i] = temperatureStrings[i].replace(regex, "");
      if (unit == "°F") {
        temperatureStrings[i] = toF(Number(temperatureStrings[i])).toString();
      }
      temperatureStrings[i] += unit;
    }
    return temperatureStrings;
  }

function storeData(data:any): void {
    let temperatureStrings: string[] = [data.temperature, data.forecast[0].temperature, data.forecast[1].temperature, data.forecast[2].temperature];
    temperatureStrings = processTemperatureStrings(temperatureStrings);
    for (let i = 0; i < temperatureStrings.length; i++) {
      localStore.setItem("day" + i.toString() + "_temperature", temperatureStrings[i]);
    }
    localStore.setItem("day0_description", data.description);
    localStore.setItem("day0_wind", data.wind);
    localStore.setItem("day1_wind", data.forecast[0].wind);
    localStore.setItem("day2_wind", data.forecast[1].wind);
    localStore.setItem("day3_wind", data.forecast[2].wind);
  
    localStore.setItem("timestamp", Date.now().toString());
    let lastUpdateTime = "Updated " + new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
    localStore.setItem("lastUpdateTime", lastUpdateTime);
  }

function toF(cent: number): number {
    return Math.round(((cent * 9 / 5) + 32));
  }
function toC(fah: number) : number {
return fah == 0 ? 0 : Math.round((fah-32) / 1.8);
}

export function toggleUnit(): void {
    // Enables the toggle between units. It stores the unit in localStorage to be retrieved by the temperature text widgets.
    let unit = localStore.getItem("unit");
    if ( unit == null ) {
        let currentTemp = localStore.getItem("temp");
        if ( currentTemp != null ) {
            if ( currentTemp.includes("°C") ) {
                unit = "°C";
            } else {
                unit = "°F";
            }
        } else {
            unit = "°C";
        }
    }
    if ( unit == "°C"){
      unit = "F";
    } else {
      unit = "C";
    }
    localStore.setItem("unit", "°" + unit);
    changeUnitInStorage("day0_temperature", unit);
    changeUnitInStorage("day1_temperature", unit);
    changeUnitInStorage("day2_temperature", unit);
    changeUnitInStorage("day3_temperature", unit);
  }

export function updateTimeStrings(): void {
    let day_time = new Date().toLocaleString('en-gb', { weekday: 'long', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
    let day_date_time = new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
    let date = new Date().toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
    localStore.setItem("day_date_time", day_date_time);
    localStore.setItem("day_time", day_time);
    localStore.setItem("date", date);
  
    for (let i = 1; i < 4; i++) {
      let futureDay = new Date();
      futureDay.setDate(new Date().getDate() + i);
      let short_day = futureDay.toLocaleString('en-gb', { weekday: 'short'}).replaceAll(",","");
      let date = futureDay.toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
      let day_date = futureDay.toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
      localStore.setItem("day" + i.toString() + "_day_date", day_date);
      localStore.setItem("day" + i.toString() + "_short_day", short_day);
      localStore.setItem("day" + i.toString() + "_date", date);
    }
  }