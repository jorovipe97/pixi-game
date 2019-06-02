import * as PIXI from 'pixi.js';
import { RichTextToken, TOKEN_TYPES } from './RichTextToken';
import { TextureDrawer } from '../utils/TextureDrawer';

function choice <T> (items: T[]) {
    return items[Math.floor(Math.random()*items.length)];
}

const COLORS = [
    0x7D3C98,
    0x34495E,
    0xEC7063,
    0xF1C40F,
    0x52BE80,
    0xEDBB99,
    0xD4EFDF,
    0xD6EAF8,
    0xD2B4DE,
    0x884EA0
];

export class RichText extends PIXI.Container {

    private vToken : RichTextToken[];
    private vTokenRenderer : PIXI.Sprite[];
    private textStyle : PIXI.TextStyleOptions;
    private rawString : string;
    private app : PIXI.Application;

    constructor (text : string, style : PIXI.TextStyleOptions, app : PIXI.Application) {
        super();

        // init object members
        this.textStyle = style;
        this.app = app;

        // draw a tokenized text
        this.text = text;
    }

    get text () {
        return this.rawString;
    }

    set text (value : string) {
        // store las raw string
        this.rawString = value;

        // tokenize the user string
        this.tokenize(value);

        // render token arr
        this.drawTokens();
    }

    /**
     * Performs lexical analysis to a string, and generate tokens
     * @param text String that will be tokenized
     */
    private tokenize (text : string) : void {
        //const subStrings = text.split(imageTokenRegex);

        // clear token arr
        this.vToken = [];

        // buffer for storing the image name
        let imageNameBuffer : string[] = [];
        let isImageName = false;

        // buffer for storing a set of words
        let wordsBuffer : string[] = [];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            // check for the string "[:" inside the user stream
            if (RichText.isLeftImageControl(char, nextChar)) {
                isImageName = true;
            }
        
            if (isImageName) {
                // create a token whose value are the chars inside the word buffer
                if (wordsBuffer.length) {
                    this.vToken.push(new RichTextToken(TOKEN_TYPES.WORD, wordsBuffer.join('')));
                    wordsBuffer = []; // clears the words buffer
                }

                if (char === '[') continue; // ignore "[" and "]" characters

                // add character to the image name buffer
                imageNameBuffer.push(char);

                // check for the string ":]" inside the user stream
                if (RichText.isRightImageControl(char, nextChar)) {
                    isImageName = false;
                }

                if (!isImageName) {
                    this.vToken.push(new RichTextToken(TOKEN_TYPES.IMAGE, imageNameBuffer.join('')));
                    imageNameBuffer = []; // clear image name buffer
                }
            } else {
                if (char === ']') continue; // ignore "[" and "]" characters

                // add character to the word buffer
                wordsBuffer.push(char);
            }
        }
        
        // create word token if array was not cleared before exiting the loop
        if (wordsBuffer.length) {
            this.vToken.push(new RichTextToken(TOKEN_TYPES.WORD, wordsBuffer.join('')));
            wordsBuffer = []; // clears the words buffer
        }
    }

    /**
     * Draws an array of tokens
     */
    private drawTokens () {
        // clear token renderer arr
        this.vTokenRenderer = [];


        let lastX = 0;

        // generate the token renderers
        for (let i = 0; i < this.vToken.length; i++) {
            const token = this.vToken[i];
            let tokenRenderer;

            if (token.isImage) {
                const texture = this.renderImageToken(token);
                if (texture) {
                    tokenRenderer = new PIXI.Sprite(texture);
                    tokenRenderer.tint = choice(COLORS);
                } else {
                    tokenRenderer = new PIXI.Text(token.value, this.textStyle);
                }
            } else {
                // add renderer to container
                tokenRenderer = new PIXI.Text(token.value, this.textStyle);
            }

            this.vTokenRenderer.push(tokenRenderer);
            this.addChild(tokenRenderer);
            
            // positionate token renderer
            tokenRenderer.x = lastX;
            // tokenRenderer.y = i * tokenRenderer.height;
            lastX = tokenRenderer.x + tokenRenderer.width;
            
            
        }
    }

    renderImageToken (token : RichTextToken) {
        // reference text for calculating shape size
        const refText = new PIXI.Text('qA9', this.textStyle);

        switch (token.value) {
            case ':square:':
            return TextureDrawer.square(refText.height, this.app);
            case ':circle:':
            return TextureDrawer.circle(refText.height, this.app);
            case ':triangle:':
            return TextureDrawer.triangle(refText.height, this.app);
            case ':halfCircle:':
            return TextureDrawer.halfCircle(refText.height, this.app);
            case ':heart:':
            return TextureDrawer.heart(refText.height, this.app);
            case ':arrow:':
            return TextureDrawer.arrow(refText.height, this.app);
            default:
            return null;
        }

    }

    static isLeftImageControl (currChar : string, nextChar : string) {
        return currChar === '[' && nextChar === ':';
    }

    static isRightImageControl (currChar : string, nextChar : string) {
        return currChar === ':' && nextChar === ']';
    }
}