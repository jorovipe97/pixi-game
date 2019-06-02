import * as PIXI from 'pixi.js';
import View from './View';
import { Button } from '../components/button/Button';
import { TextView } from './TextView';
import { CardsView } from './CardsView';

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

        // create button1 for open test 1
        this.button1 = new Button(buttonTexture, 'Test 1');
        this.button1.on('pointerdown', this.mousedownTest1, this);
        this.addChild(this.button1);

        // create button2 for open test 2
        this.button2 = new Button(buttonTexture, 'Test 2');
        this.button2.on('pointerdown', this.mousedownTest2, this);
        this.addChild(this.button2);

        // create button2 for open test 3
        this.button3 = new Button(buttonTexture, 'Test 3');
        this.button3.on('pointerdown', this.mousedownTest3, this);
        this.addChild(this.button3);
    }

    updateView () {

    }

    onResize () {
        this.text.x = (this.screenWidth - this.text.width) * 0.5;
        const lineSpacing = this.button1.height * 0.5;
        const menuHeight : number = lineSpacing * 3 + this.text.height + this.button1.height * 3;

        // vertically centered.
        this.text.y = (this.screenHeight - menuHeight) * 0.5;

        this.button1.x = (this.screenWidth - this.button1.width) * 0.5;
        this.button1.y = this.text.y + this.text.height + lineSpacing;

        this.button2.x = (this.screenWidth - this.button2.width) * 0.5;
        this.button2.y = this.button1.y + this.button1.height + lineSpacing;

        this.button3.x = (this.screenWidth - this.button3.width) * 0.5;
        this.button3.y = this.button2.y + this.button2.height + lineSpacing;
    }

    private mousedownTest1 () : void {
        console.log('clicked 1!');
        new CardsView(this.app);
        this.destroy();
    }

    private mousedownTest2 () : void {
        console.log('clicked 2!');
        new TextView(this.app);
        this.destroy();
    }

    private mousedownTest3 () : void {
        console.log('clicked 3!');
    }
}