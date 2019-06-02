import * as PIXI from 'pixi.js';
import { MainView } from './views/MainView';
import { CardsView } from './views/CardsView';
import { TextView } from './views/TextView';
import { ParticlesView } from './views/ParticlesView';

let app : PIXI.Application;
function start () : void {
    app = initApp();    onResize();    new MainView(app);
}

function onResize () : void {
    // Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

/**
 * Creates the html5 canvas element and append it to the body.
 */
function initApp(): PIXI.Application {
    const app = new PIXI.Application({
        autoResize: true,
        backgroundColor: 0x353b48,
        resolution: devicePixelRatio
    });

    document.body.appendChild(app.view);

    // document.body.appendChild(app.view);
    // const renderer = PIXI.autoDetectRenderer(512, 512);
    // document.body.appendChild(renderer.view);
    return app;
}

/**
 *  Loads the resources we need in the Game
 *  and calls the provided callback when done.
 *
 *  @param {Array}      resources       The resources to load
 *  @param {Function}   cb              The function to call when the loading is completed
 *
 *  @returns {Void}
 */
function preloadResources (resources : string [], cb : any) {

    // Add the resources and trigger Callback when loaded
    PIXI.loader
        .add(resources)
        // .on("progress", loader => console.log(`${loader.progress}% completed`))
        .load(cb);
};

// Wait until the page is fully loaded
window.addEventListener("load", () => {
    // List of resources to load
    const resources = ["images/flame.png"];

    preloadResources(resources, () => {
        start();
    });
});

// Listen for window resize events
window.addEventListener('resize', onResize);
