/*
    Function to manage the asynchronous fetch of data from the API. It is called regularly on a setInterval timeout, but only fetches new
    data from the API if 15 minutes have expired from the previous fetch.
    It calls other functions to manage the update of localStorage, so triggering onChange callback events.
    Usage: getData()
*/

import { localStore } from "./data";
import { toF, isNight } from "./utils";

/* Manages the update to localStorage for the time strings used by the app*/
export function updateTimeStrings() {
    // Get and format desired day/date/time strings
    let day_time = new Date().toLocaleString('en-gb', { weekday: 'long', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
    let day_date_time = new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
    let date = new Date().toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");

    // Day 1 : Tomorrow
    let futureDay = new Date();
    futureDay.setDate(new Date().getDate() + 1);
    let day1_short_day = futureDay.toLocaleString('en-gb', { weekday: 'short'}).replaceAll(",","");
    let day1_date = futureDay.toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
    let day1_day_date = futureDay.toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
    // Day 2 : Tomorrow + 1
    futureDay.setDate(new Date().getDate() + 2);
    let day2_short_day = futureDay.toLocaleString('en-gb', { weekday: 'short'}).replaceAll(",","");
    let day2_date = futureDay.toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
    let day2_day_date = futureDay.toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
    // Day 3 : Tomorrow + 2
    futureDay.setDate(new Date().getDate() + 3);
    let day3_short_day = futureDay.toLocaleString('en-gb', { weekday: 'short'}).replaceAll(",","");
    let day3_date = futureDay.toLocaleString('en-gb', { day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");
    let day3_day_date = futureDay.toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit'}).replaceAll(",","");

    // If not already present in localStorage then set them, otherwise update them
    localStore.get("day_time") == null ? localStore.set("day_time", day_time) : localStore.update("day_time", day_time);
    localStore.get("day_date_time") == null ? localStore.set("day_date_time", day_date_time) : localStore.update("day_date_time", day_date_time);
    localStore.get("date") == null ? localStore.set("date", date) : localStore.update("date", date);
    localStore.get("day1_short_day") == null ? localStore.set("day1_short_day", day1_short_day) : localStore.update("day1_short_day", day1_short_day);
    localStore.get("day1_date") == null ? localStore.set("day1_date", day1_date) : localStore.update("day1_date", day1_date);
    localStore.get("day1_day_date") == null ? localStore.set("day1_day_date", day1_day_date) : localStore.update("day1_day_date", day1_day_date);
    localStore.get("day2_short_day") == null ? localStore.set("day2_short_day", day2_short_day) : localStore.update("day2_short_day", day2_short_day);
    localStore.get("day2_date") == null ? localStore.set("day2_date", day2_date) : localStore.update("day2_date", day2_date);
    localStore.get("day2_day_date") == null ? localStore.set("day2_day_date", day2_day_date) : localStore.update("day2_day_date", day2_day_date);
    localStore.get("day3_short_day") == null ? localStore.set("day3_short_day", day3_short_day) : localStore.update("day3_short_day", day3_short_day);
    localStore.get("day3_date") == null ? localStore.set("day3_date", day3_date) : localStore.update("day3_date", day3_date);
    localStore.get("day3_day_date") == null ? localStore.set("day3_day_date", day3_day_date) : localStore.update("day3_day_date", day3_day_date);

    // Update css class of the canvas
    let cssClass: string = isNight() ? "night" : "day";
    localStore.update("cssClass", cssClass);
}

/*
    If the response from the API is in error a timeout is set to call itself again 1 second later. It will store the temperature data in the unit
    currently in view (F or C).
    */
export function getData() {             // Checks the timestamp stored in localStorage, if old it requests new data from the API and updates localStorage
    const API_URL: string = "https://goweather.herokuapp.com/weather/london";
    let timestamp: number = Number(localStore.get("timestamp"));
    //localStorage.removeItem("timestamp");
    updateTimeStrings();    // Update the time/day/date strings in localStorage
    if (Math.floor((Date.now() - timestamp) / 1000) >= 899 ) {      // Data is older than 15 minutes
        fetch(API_URL).then(
            response => response.json()).then(data => {     // Promise returned good
                //data = JSON.parse('{"temperature":"0 °C","wind":"11 km/h","description":"Clear","forecast":[{"day":"1","temperature":"-2 °C","wind":"24 km/h"},{"day":"2","temperature":"10 °C","wind":"41 km/h"},{"day":"3","temperature":"+11 °C","wind":"28 km/h"}]}');
                localStore.update("timestamp", Date.now().toString());
                let lastUpdateTime = "Updated " + new Date().toLocaleString('en-gb', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}).replaceAll(",","");
                localStore.get("lastUpdateTime") == null ? localStore.set("lastUpdateTime", lastUpdateTime) : localStore.update("lastUpdateTime", lastUpdateTime);                
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

                // Process temperatures in desired unit
                let currentTemp: string = data.temperature;
                const regex = /[^\d\.\-]+/g;
                currentTemp = currentTemp.replace(regex, "");
                if ( unit == "°F" ){
                    currentTemp = toF(Number(currentTemp)).toString();
                }               
                let day1Temp = data.forecast[0].temperature;
                day1Temp = day1Temp.replace(regex, "");
                if ( unit == "°F" ){
                    day1Temp = toF(Number(day1Temp)).toString();
                }              
                let day2Temp = data.forecast[1].temperature;
                day2Temp = day2Temp.replace(regex, "");
                if ( unit == "°F" ){
                    day2Temp = toF(Number(day2Temp)).toString();
                }
                let day3Temp = data.forecast[2].temperature;
                day3Temp = day3Temp.replace(regex, "");
                if ( unit == "°F" ){
                    day3Temp = toF(Number(day3Temp)).toString();
                }
                // If not already present in localStorage then set them, otherwise update them
                localStore.get("temp") == null ? localStore.set("temp", currentTemp + unit) : localStore.update("temp", currentTemp + unit);
                localStore.get("tempDay1") == null ? localStore.set("tempDay1", day1Temp + unit) : localStore.update("tempDay1", day1Temp + unit);
                localStore.get("tempDay2") == null ? localStore.set("tempDay2", day2Temp + unit) : localStore.update("tempDay2", day2Temp + unit);
                localStore.get("tempDay3") == null ? localStore.set("tempDay3", day3Temp + unit) : localStore.update("tempDay3", day3Temp + unit);
                localStore.get("description") == null ? localStore.set("description", data.description) : localStore.update("description", data.description);
                localStore.get("wind") == null ? localStore.set("wind", data.wind) : localStore.update("wind", data.wind);
                localStore.get("windDay1") == null ? localStore.set("windDay1", data.forecast[0].wind) : localStore.update("windDay1", data.forecast[0].wind);
                localStore.get("windDay2") == null ? localStore.set("windDay2", data.forecast[1].wind) : localStore.update("windDay2", data.forecast[1].wind);
                localStore.get("windDay3") == null ? localStore.set("windDay3", data.forecast[2].wind) : localStore.update("windDay3", data.forecast[2].wind);
            },
            function() {
                // Promise returned error, retrying...
                window.setTimeout(getData, 1000);
            }
        );
    }
}
