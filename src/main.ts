import './style.css'
import CanvasContainer from './canvas'
import { getData } from './utils'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="view"></canvas>
`
window.onload = () => {
  getData();
  window.setTimeout(()=>{ getData(); }, 900000);
  var screenCanvas = new CanvasContainer(document.querySelector<HTMLCanvasElement>('#view')!);
  window.addEventListener('resize', ()=>{screenCanvas.resize();}, true)
  window.setTimeout(()=>{
    screenCanvas.context.clearRect(0,0,screenCanvas.canvas.width, screenCanvas.canvas.height);
    screenCanvas.draw();
  },60000);
}
