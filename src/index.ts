import * as PIXI from 'pixi.js';
import { MainView } from './views/MainView';
import { CardsView } from './views/CardsView';

let app : PIXI.Application;
function start () : void {
    app = initApp();    onResize();    new CardsView(app);
}

function onResize () : void {
    // Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

/**
 * Creates the html5 canvas element and append it to the body.
 */
export function initApp(): PIXI.Application {
    const app = new PIXI.Application({
        autoResize: true,
        backgroundColor: 0x48dbfb,
        resolution: devicePixelRatio
    });

    document.body.appendChild(app.view);

    // document.body.appendChild(app.view);
    // const renderer = PIXI.autoDetectRenderer(512, 512);
    // document.body.appendChild(renderer.view);
    return app;
}

// Wait until the page is fully loaded
window.addEventListener("load", start);

// Listen for window resize events
window.addEventListener('resize', onResize);
