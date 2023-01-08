import "./style.css";
import CanvasContainer from "./canvas";
import { toggleUnit } from "./utils";
import { getData } from "./async_fetch";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="view"></canvas>
  `

window.onload = () => {
  getData();
  var screenCanvas = new CanvasContainer(document.querySelector<HTMLCanvasElement>('#view')!);
  window.addEventListener('resize', ()=>{screenCanvas.resize();}, true)
  screenCanvas.get().addEventListener('click', toggleUnit, false);
  window.setInterval(()=>{  // Update the time every minute
    getData()            
  },60000);
}
