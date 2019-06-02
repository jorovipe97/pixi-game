import * as PIXI from 'pixi.js';
import View from "./View";
import { Button } from '../components/button/Button';
import { MainView } from './MainView';
import { RichText } from '../components/richText/RichText';

function choice <T> (items: T[]) {
    return items[Math.floor(Math.random()*items.length)];
}

// square, circle, triangle, halfCircle, heart
const IMAGE_NAMES = [
    '[:square:]',
    '[:circle:]',
    '[:triangle:]',
    '[:halfCircle:]',
    '[:heart:]',
];

const FONT_SIZES = [
    28, 25, 32, 40, 28, 38
];

export class TextView extends View {

    backButton : Button;
    rawText : PIXI.Text;
    richText : RichText;
    richTextDestroyed : boolean;

    /**
     * Time in seconds
     */
    private timeCounter : number = 0;

    startView () {
        // Creates a common texture.
        const buttonTexture : PIXI.Texture = Button.createButtonTexture({
            width: 80,
            height: 50,
            radius: 5,
            app: this.app
        });

        // create button1 for open test 1
        this.backButton = new Button(buttonTexture, 'Back');
        this.backButton.on('pointerup', this.mousedownBackButton, this);
        this.addChild(this.backButton);
        this.richTextDestroyed = false;

        // square, circle, triangle, halfCircle, heart
        const randomString = this.getRandomExpression();
        this.richText = new RichText(randomString, { fontSize: choice(FONT_SIZES), fill: 0xFF5733 }, this.app);
        this.addChild(this.richText);

        // draw raw expression
        this.rawText = new PIXI.Text(randomString, { fontSize: 15, fill: 0xffffff});
        this.addChild(this.rawText);
    }

    updateView () {

        // change the expression each 2 seconds
        if (this.timeCounter >= 2) {
            this.richText.destroy(); // destroy previous rich text
            this.richTextDestroyed = true;

            // create a new rich text

            // square, circle, triangle, halfCircle, heart
            const randomString = this.getRandomExpression();
            this.richText = new RichText(randomString, { fontSize: choice(FONT_SIZES), fill: 0xFF5733 }, this.app);
            this.addChild(this.richText);
            this.richTextDestroyed = false;

            // draw raw expression
            this.rawText.text = randomString;

            this.timeCounter = 0; // reset time counter
            this.onResize(); // recalculate positions
        }

        console.log(this.timeCounter)
        this.timeCounter += this.app.ticker.elapsedMS / 1000;
    }

    onResize () {
        const standardPadding = 20;

        // setup back button
        this.backButton.x = this.screenWidth - this.backButton.width - standardPadding;
        this.backButton.y = standardPadding;

        // setup title text
        if (!this.richTextDestroyed) {
            this.richText.x = (this.screenWidth - this.richText.width) * 0.5;
            this.richText.y = (this.screenHeight - this.richText.height) * 0.5;
        }

        // positionate raw text
        this.rawText.x = (this.screenWidth - this.rawText.width) * 0.5;
        this.rawText.y = this.richText.y + this.richText.height + standardPadding * 2;
    }

    private getRandomExpression () {
        const expressions = [
            'The happy ' + choice(IMAGE_NAMES) + ' is playing dices',
            'Fred it seems like a ' + choice(IMAGE_NAMES) + ' when dancing',
            choice(IMAGE_NAMES) + ' and ' + choice(IMAGE_NAMES) + ' are the favorite Klopp\'s shapes',
            choice(IMAGE_NAMES) + ' ' + choice(IMAGE_NAMES) + ' ' + choice(IMAGE_NAMES) + ' are shapes',
            'When ' + choice(IMAGE_NAMES) + ' is merged with ' + choice(IMAGE_NAMES) + ' produces ' + choice(IMAGE_NAMES),
            'Carl J. loves to be like a ' + choice(IMAGE_NAMES),
            'My favorite shapes are ' + choice(IMAGE_NAMES) + ' ' + choice(IMAGE_NAMES) + ' ' + choice(IMAGE_NAMES) + ' ' + choice(IMAGE_NAMES) + ' ' + choice(IMAGE_NAMES)
        ];
        return choice(expressions);
    }

    private mousedownBackButton () : void {
        new MainView(this.app);
        super.destroy();
    }
}