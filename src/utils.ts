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
            fetch(API_URL).then(response => response.json())
            .then(data =>{
                if (data != "NOT_FOUND") {
                    console.log("Fetched:", data);
                    //data = JSON.parse('{"temperature":"0 °C","wind":"11 km/h","description":"Clear","forecast":[{"day":"1","temperature":"-2 °C","wind":"24 km/h"},{"day":"2","temperature":"10 °C","wind":"41 km/h"},{"day":"3","temperature":"+11 °C","wind":"28 km/h"}]}');
                    localStorage.setItem("timestamp", Date.now().toString());
                    localStorage.setItem("temperature", data.temperature);
                    localStorage.setItem("wind", data.wind);
                    localStorage.setItem("description", data.description);
                    localStorage.setItem("tempDay1", data.forecast[0].temperature);
                    localStorage.setItem("windDay1", data.forecast[0].wind);
                    localStorage.setItem("tempDay2", data.forecast[1].temperature);
                    localStorage.setItem("windDay2", data.forecast[1].wind);
                }
                else {
                    console.log("Not Found");
                }
            });
        } catch {
            console.log("Error retrieving URL");
        }
    }
}