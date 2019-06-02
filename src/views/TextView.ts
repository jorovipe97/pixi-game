import * as PIXI from 'pixi.js';
import View from "./View";

export class TextView extends View {

    text : PIXI.Text;

    startView () {
        // create title text
        this.text = new PIXI.Text('Rich text test', {
            fill: 0xFFFFFF,
            fontSize: 48
        });
        this.addChild(this.text);
    }

    updateView () {

    }

    onResize () {

    }

}