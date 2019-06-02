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

    startTime : Date;
    deltaTime : number; // time between last frame and current frame.
    then : number;
    FPS : number = 0;

    time : number = 0;
    targetFPS : number = 20;
    fpsInterval : number = 1000 / this.targetFPS;
    frameCount : number = 0;
    currentTime : number = 0;
    private reqAnimId : number;

    constructor (app : PIXI.Application) {
        super();
        this.app = app;
        this.app.stage.addChild(this);
        this.screenWidth = this.app.renderer.screen.width;
        this.screenHeight = this.app.renderer.screen.height;
        this.then = 0; // (new Date()).getMilliseconds();// performance.now();
        this.startView();
        this.attachHandlers();
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

    private update (time ? : number) : void {
        // request another frame
        this.reqAnimId = requestAnimationFrame((t) => {
            this.update(t);
        });
        // calc deltaTime time since last loop
        let now = time;// Date.now(); // performance.now();
        this.deltaTime = now - this.then;
        console.log(time/1000);
        // if enough time has deltaTime, draw the next frame
        if (this.deltaTime > this.fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            this.then = now - (this.deltaTime % this.fpsInterval);
            this.currentTime = time;
            this.FPS = 1000 / this.deltaTime;
            // Put your drawing code here
            this.updateView(time);
            // Uncomment to see FPS
            // console.log(this.FPS);
        }
    }

    private onResizeView () : void {
        this.screenWidth = this.app.renderer.screen.width;
        this.screenHeight = this.app.renderer.screen.height;

        // this.x = Math.round((this.width - this.screenHeight) * 0.5);

        this.onResize();
    }

    attachHandlers () : void {
        if (this.attachCount === 0) {
            // Register the update for the current view.
            // this.app.ticker.add(this.updateView, this);
            // this.reqAnimId = requestAnimationFrame(() => {
                
            // })
            this.update(0);

            // Listen for window resize events
            window.addEventListener('resize', this.onResizeView.bind(this));
        }
        this.attachCount++;
    }

    dettachHandlers () : void {
        // // Remove the update for the current view.
        // this.app.ticker.remove(this.updateView, this);
        cancelAnimationFrame(this.reqAnimId);

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