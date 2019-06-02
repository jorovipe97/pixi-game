import * as PIXI from 'pixi.js';

export default abstract class View extends PIXI.Container {

    private attachCount : number = 0;

    app : PIXI.Application;
    /**
     * The canvas width in screen coordinates.
     */
    screenWidth : number;
    /**
     * The canvas height in screen coordinates.
     */
    screenHeight : number;

    constructor (app : PIXI.Application) {
        super();
        this.app = app;
        this.app.stage.addChild(this);
        this.screenWidth = this.app.renderer.screen.width;
        this.screenHeight = this.app.renderer.screen.height;
        this.attachHandlers();
        this.startView();
        this.onResizeView();
    }
    /**
     * Called in the view is initilized.
     */
    abstract startView () : void;

    /**
     * Called each frame.
     * @param delta delta time
     */
    abstract updateView (delta : number) : void;

    /**
     * Called when screen is resized
     */
    abstract onResize () : void;

    private onResizeView () : void {
        this.screenWidth = this.app.renderer.screen.width;
        this.screenHeight = this.app.renderer.screen.height;
        this.onResize();
    }

    attachHandlers () : void {
        if (this.attachCount === 0) {
            // Register the update for the current view.
            this.app.ticker.add(this.updateView, this);
            // Listen for window resize events
            window.addEventListener('resize', this.onResizeView.bind(this));
        }
        this.attachCount++;
    }

    dettachHandlers () : void {
        // Remove the update for the current view.
        this.app.ticker.remove(this.updateView, this);
        // stop listening for window resize events
        window.removeEventListener('resize', this.onResize.bind(this));
        // resets this flag
        this.attachCount = 0;
    }

    destroy () {
        this.dettachHandlers();
        // TODO: Check posible memory leak when children: true (when is set to false an exception happens.)
        super.destroy({
            children: false,
            baseTexture: true,
            texture: true
        });
    }
}