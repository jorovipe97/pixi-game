import * as PIXI from 'pixi.js';


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
