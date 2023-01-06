import './style.css'
import CanvasContainer from './canvas'
import { getData, toggleUnit } from './utils'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="view"></canvas>
`
window.onload = () => {
  getData();
  var screenCanvas = new CanvasContainer(document.querySelector<HTMLCanvasElement>('#view')!);
  window.addEventListener('resize', ()=>{screenCanvas.resize();}, true)
  screenCanvas.get().addEventListener('click', toggleUnit, false);
  localStorage.setItem("unit", "°C");
}
