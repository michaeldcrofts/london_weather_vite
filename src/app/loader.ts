import "../style.css";
import * as config from "../config.json";
import { localStore } from "../data";
import { fetchData, updateTimeStrings } from "./dataProcessing";
import { refreshView, resize } from "./viewControl";

window.onload = async () => {
    fetchData(config.API_URL);  // Query for data
    updateTimeStrings();
    localStore.setItem("location", config.location);
    refreshView();

    // Trigger a full refresh to the view if the description changes
    localStore.setItem("description", localStore.getItem("description") || "-", () => {
        refreshView();
    });

    window.setInterval( async () => {  // Look for new data and update the time every minute
        fetchData(config.API_URL);
        updateTimeStrings();    
    },10000);

    window.addEventListener('resize', resize, true);
}