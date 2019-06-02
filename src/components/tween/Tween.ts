import * as PIXI from 'pixi.js';
import View from '../../views/View';
import { CardsView } from '../../views/CardsView';

export class Tween {
    private moveToOptions : MoveToOptions;
    private dist : number;
    private duration : number;
    private deltaDist : number;
    private deltaX : number;
    private deltaY : number;
    private totalElapsed : number;
    private displayObject : PIXI.DisplayObject;
    /**
     * Time in seconds
     */
    private time : number;
    private isEasing : boolean;
    private startTime : Date;
    private frameCount : number = 0;
    
    constructor (displayObject : PIXI.DisplayObject, options : MoveToOptions) {
        this.moveToOptions = options;
        this.displayObject = displayObject;
        // If you want "300 pixels per second" you use "0.3 * elapsedMs"
        this.duration = options.duration;
        this.isEasing = true;
        this.time = 0;

        this.startTime = new Date();
    }

    /**
     * Called in the update.
     * @param number The time time from the last frame in ms.
     */
    update (elapsed : number, deltaTime : number) : void {

        if (!this.isEasing) {
            return;
        }
        const ease = 0.1;
        const dx = this.moveToOptions.to.x - this.displayObject.x;
        const dy = this.moveToOptions.to.y - this.displayObject.y;
        const vx = dx * ease;
        const vy = dy * ease;

        // standard exponential slider.
        this.displayObject.x += vx;
        this.displayObject.y += vy;

        // To avoid roots im not using pythaforas' theorem.
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            this.isEasing = false;
            this.displayObject.x = this.moveToOptions.to.x;
            this.displayObject.y **= this.moveToOptions.to.y;
        }


        // let t = this.time / this.duration;
        // console.log(t);
        // this.displayObject.x = (this.displayObject.x * (1 - t) + this.moveToOptions.to.x * t);
        // this.displayObject.y = (this.displayObject.y * (1 - t) + this.moveToOptions.to.y * t);

        // // if (t > 1) debugger;
        // if (this.time > this.duration) {
        //     this.time = this.duration;
        //     // debugger;
        // } else {
        //     this.time += deltaTime / 1000;
        // }
    }

    /**
     * Rober Penner linear tween equation
     * @param t Current time
     * @param b Beginning value
     * @param c Change in value
     * @param d duration
     */
    linearTween (t : number, b : number, c : number, d : number) : number {
        return c * (t / d) + b;
    }

    debugTween (viewInstance : View) {
        const ease = 0.1;
        const dx = (this.moveToOptions.to.x - this.displayObject.x) * viewInstance.deltaTime / 1000; // TODO: Multiply this by a delta
        const dy = (this.moveToOptions.to.y - this.displayObject.y) * viewInstance.deltaTime / 1000;
        const vx = dx * ease;
        const vy = dy * ease;
        
        // this.time = (new Date()).getMilliseconds() - this.startTime.getMilliseconds();
        // console.log(this.time);
        // if (this.frameCount > 60) {
        //     debugger;
        //     this.frameCount = 0;
        // }
        // this.time += view.now;
        // this.frameCount++;
        // console.log(this.now);

        let time = viewInstance.currentTime;
        // console.log(time);
        this.displayObject.x = this.linearTween(time, this.displayObject.x, dx, 3000);
        this.displayObject.y = this.linearTween(time, this.displayObject.y, dy, 3000);
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
}