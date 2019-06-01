import * as PIXI from 'pixi.js';
import View from './views/View';
import { initApp } from './initApp';
import { MainView } from './views/MainView';

let app : PIXI.Application;
function start () : void {
    app = initApp();    onResize();    new MainView(app);
}

function onResize () : void {
    // Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

// Wait until the page is fully loaded
window.addEventListener("load", () => {
    // Then run the setup() function
    start();
});

// Listen for window resize events
window.addEventListener('resize', onResize);
