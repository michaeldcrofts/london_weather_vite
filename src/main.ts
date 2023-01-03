import './style.css'
import CanvasContainer from './canvas'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="view"></canvas>
`
var screenCanvas = new CanvasContainer(document.querySelector<HTMLCanvasElement>('#view')!);
window.addEventListener('resize', ()=>{screenCanvas.resize();}, true)
