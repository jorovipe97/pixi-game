import * as PIXI from 'pixi.js';
import View from './View';
import { Button } from '../components/button/Button';


export class MainView extends View {
    text : PIXI.Text;
    button1 : Button;
    button2 : Button;
    button3 : Button;
    startView () {

        // create title text
        this.text = new PIXI.Text('The PIXI Game', {
            fill: 0xFFFFFF,
            fontSize: 48
        });
        this.addChild(this.text);

        // Creates a common button1 texture.
        const buttonTexture : PIXI.Texture = Button.createButtonTexture({
            width: 250,
            height: 50,
            radius: 5,
            app: this.app
        });

        // create test 1 button1
        this.button1 = new Button(buttonTexture, 'Test 1');
        this.button1.on('pointerdown', this.mousedownTest1, this);
        this.addChild(this.button1);

        this.button2 = new Button(buttonTexture, 'Test 2');
        this.button2.on('pointerdown', this.mousedownTest2, this);
        this.addChild(this.button2);

        this.button3 = new Button(buttonTexture, 'Test 3');
        this.button3.on('pointerdown', this.mousedownTest3, this);
        this.addChild(this.button3);

        this.updatePositions();
    }

    private mousedownTest1 () : void {
        console.log('clicked 1!');
    }

    private mousedownTest2 () : void {
        console.log('clicked 2!');
    }

    private mousedownTest3 () : void {
        console.log('clicked 3!');
    }

    private updatePositions () : void {
        this.text.x = (this.app.renderer.width - this.text.width) * 0.5;        
        const lineSpacing = this.button1.height * 0.5;
        const menuHeight : number = lineSpacing * 3 + this.text.height + this.button1.height * 3;
        // vertically centered.
        this.text.y = (this.app.renderer.height - menuHeight) * 0.5;

        this.button1.x = (this.app.renderer.width - this.button1.width) * 0.5;
        this.button1.y = this.text.y + this.text.height + lineSpacing;

        this.button2.x = (this.app.renderer.width - this.button2.width) * 0.5;
        this.button2.y = this.button1.y + this.button1.height + lineSpacing;

        this.button3.x = (this.app.renderer.width - this.button3.width) * 0.5;
        this.button3.y = this.button2.y + this.button2.height + lineSpacing;
    }

    updateView () {

    }

    onResize () {
        this.updatePositions();
    }
}