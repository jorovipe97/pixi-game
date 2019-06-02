import * as PIXI from 'pixi.js';

export class Tween {
    private moveToOptions : MoveToOptions;
    private duration : number;
    private displayObject : PIXI.DisplayObject;
    /**
     * Time in seconds
     */
    private timeCounter : number;
    private isEasing : boolean;
    private beginX : number = 0;
    private beginY : number = 0;
    private isFirstFrame : boolean;

    constructor (displayObject : PIXI.DisplayObject, options : MoveToOptions) {
        this.moveToOptions = options;
        this.displayObject = displayObject;
        // If you want "300 pixels per second" you use "0.3 * elapsedMs"
        this.duration = options.duration;
        this.isEasing = true;
        this.timeCounter = 0;
        this.isFirstFrame = true;

        this.beginX = this.displayObject.x;
        this.beginY = this.displayObject.y;
    }

    /**
     * Called in the update.
     * @param number The timeCounter timeCounter from the last frame in ms.
     */
    update (elapsed : number) : void {
        if (!this.isEasing) {
            return;
        }

        // is delay defined?
        if (this.moveToOptions.delay > 0) {
            // elapsed time is minor than defined delay?
            if (this.timeCounter < this.moveToOptions.delay) {
                this.timeCounter += elapsed / 1000;
                return;
            }
            // the next cycle the delay the tween will have effect
            this.moveToOptions.delay = 0;
            this.timeCounter = 0;
        }

        if (this.isFirstFrame) {
            if (typeof this.moveToOptions.onStart === 'function') this.moveToOptions.onStart();
            this.isFirstFrame = false;
        }

        const dx = this.moveToOptions.to.x - this.beginX;
        const dy = this.moveToOptions.to.y - this.beginY;

        // console.log(timeCounter);
        this.displayObject.x = this.easeOutQuad(this.timeCounter, this.beginX, dx, this.duration);
        this.displayObject.y = this.easeOutQuad(this.timeCounter, this.beginY, dy, this.duration);
        this.timeCounter += elapsed / 1000;
        // console.log(this.beginY);

        // To avoid roots im not using pythaforas' theorem.
        let distX = this.moveToOptions.to.x - this.displayObject.x;
        let distY = this.moveToOptions.to.y - this.displayObject.y;
        if (Math.abs(distX) < 0.1 && Math.abs(distY) < 0.1) {
            this.isEasing = false;
            this.displayObject.x = this.moveToOptions.to.x;
            this.displayObject.y = this.moveToOptions.to.y;
        }
    }

    /**
     * Rober Penner linear tween equation
     * @param t Current timeCounter
     * @param b Beginning value
     * @param c Change in value
     * @param d duration
     */
    linearTween (t : number, b : number, c : number, d : number) : number {
        const num = c * (t / d) + b;
        console.log(num);
        return num;
    }

    /**
     * Rober Penner linear tween equation
     * quadratic easing in/out - acceleration until halfway, then deceleration
     * @param t Current timeCounter
     * @param b Beginning value
     * @param c Change in value
     * @param d duration
     */
    easeInOutQuad (t : number, b : number, c : number, d : number) : number {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    }

    /**
     * Rober Penner linear tween equation
     * quadratic easing out - decelerating to zero velocity
     * @param t Current timeCounter
     * @param b Beginning value
     * @param c Change in value
     * @param d duration
     */
    easeOutQuad (t : number, b : number, c : number, d : number) : number {
        return -c *(t/=d)*(t-2) + b;
    }
}

interface PointObject {
    x : number;
    y : number;
};

interface MoveToOptions {
    to : PointObject;
    duration : number;
    delay ?: number;
    onStart?(): void;
}