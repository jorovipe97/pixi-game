import * as PIXI from 'pixi.js';

export default abstract class View extends PIXI.Container {
    app : PIXI.Application;
    private attachCount : number = 0;

    constructor (app : PIXI.Application) {
        super();
        this.app = app;
        this.app.stage.addChild(this);
        this.attachHandlers();
        this.startView();
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

    abstract onResize () : void;

    attachHandlers () : void {
        if (this.attachCount === 0) {
            // Register the update for the current view.
            this.app.ticker.add(this.updateView, this);
            // Listen for window resize events
            window.addEventListener('resize', this.onResize.bind(this));
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
        super.destroy();
    }
}