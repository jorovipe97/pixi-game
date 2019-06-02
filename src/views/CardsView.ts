import * as PIXI from 'pixi.js';
import View from './View';
import { Button } from '../components/button/Button';
import { MainView } from './MainView';

// My minimalistic tween library.
import { Tween } from '../components/tween/Tween';

export class CardsView extends View {
    backButton : Button;
    cards : PIXI.Sprite[];
    yOffset : number;
    fpsText : PIXI.Text;
    time : number;
    tween1 : Tween;
    tweens : Tween[];

    startView () {
        this.cards = [];
        const cardsCount = 144;
        this.yOffset = 5;

        const buttonTexture : PIXI.Texture = Button.createButtonTexture({
            width: this.screenWidth * 0.25,
            height: this.screenHeight * 0.10,
            radius: 5,
            app: this.app
        });
        this.backButton = new Button(buttonTexture, 'Back');
        this.backButton.on('pointerup', this.pointerdownBackButton, this);
        this.addChild(this.backButton);

        const width = 40;
        const stackHeight = this.screenHeight * 0.85;
        const initY = this.screenHeight * 0.05;
        const finalY = this.screenHeight - initY;
        const d = cardsCount - 1;
        // ensures the cards are occuping the 80% of the screen height.
        // const height = (finalY - initY + this.yOffset * d) / cardsCount;
        const height = 40;

        const cardTexture = this.generateTextureCard(width, height);

        
        for (let i = 0; i < cardsCount; i++) {
            const sprite = new PIXI.Sprite(cardTexture);
            sprite.x = sprite.x = this.screenWidth * 0.5 - sprite.width - 30;
            sprite.y = initY + this.yOffset * i;
            this.addChild(sprite);
            this.cards.push(sprite);
        }

        // this.cards[0].x += 100;
        const indexLastCard = cardsCount - 1;
        this.tween1 = new Tween(this.cards[0], {
            to: {
                x: 0,
                y: this.cards[0].y
            },
            delay: 2,
            duration: 2
        });
        this.tweens = [];
        for (let i = indexLastCard; i >= 0; i--) {
            const card = this.cards[i];
            const delay = cardsCount - i + 1;
            const inverseI = indexLastCard - i;
            const targetX = this.screenWidth * 0.5 + 30;
            const targetY = initY + inverseI * this.yOffset;

            let tween = new Tween(card, {
                to: {
                    x: targetX,
                    y: targetY
                },
                delay: delay,
                duration: 2,
                onStart: () => { // updates z-index in the new stack
                    this.addChild(card);
                }
            });
            this.tweens.push(tween);
        }

        this.fpsText = new PIXI.Text('FPS: ');
        this.addChild(this.fpsText);
    }

    updateView (time : number) {
        const FPS = this.app.ticker.FPS.toFixed(3);
        this.fpsText.text = `FPS: ${FPS}`;

        // let deltaTime = this.app.ticker.elapsedMS * this.app.ticker.speed;
        let elapsed = this.app.ticker.elapsedMS;//this.app.ticker.deltaTime / PIXI.settings.TARGET_FPMS;
        // this.tween1.update(elapsed);
        for (let i = 0; i < this.tweens.length; i++) {
            let tween = this.tweens[i];
            tween.update(elapsed);
        }
    }

    onResize () {
        const standardPadding = 20;
        this.backButton.x = this.screenWidth - this.backButton.width - standardPadding;
        this.backButton.y = standardPadding;

        this.fpsText.x = standardPadding;
        this.fpsText.y = standardPadding;
    }

    private pointerdownBackButton () {
        console.log('backbutton clicked!');
        new MainView(this.app);
        this.destroy();
    }

    private generateTextureCard(width : number, height : number) {
        // Render a gaphic to a texture
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.lineStyle(1, 0x000000);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
        
        const texture = this.app.renderer.generateTexture(graphics);
        graphics.destroy();
        return texture;
    }
}