import * as PIXI from 'pixi.js';

export class Button extends PIXI.Sprite {
    hoverTint : number = 0xecf0f1;
    downTint : number = 0x95a5a6;
    normalTint : number = 0xFFFFFF;
    text : PIXI.Text;
    constructor (texture : PIXI.Texture, text : string, style?: any) {
        super(texture);
        // Enable events
        this.interactive = true;
        // Setting this changes the 'cursor' property to 'pointer'.
        this.buttonMode = true;

        this.text = new PIXI.Text(text, style);
        this.addChild(this.text);

        this.text.x = (this.width - this.text.width) * 0.5;
        this.text.y = (this.height - this.text.height) * 0.5;

        this.on('pointerdown', this.onButtonDown, this);
        this.on('pointerup', this.onButtonUp, this);
        this.on('pointerupoutside', this.onButtonUp, this);
        this.on('pointerover', this.onButtonOver, this);
        this.on('pointerout', this.onButtonOut, this);
    }

    private onButtonDown () : void {
        this.tint = this.downTint;
    }

    private onButtonUp () : void {
        this.tint = this.normalTint;
    }

    private onButtonOver () : void {
        this.tint = this.hoverTint;
    }

    private onButtonOut () : void {
        this.tint = this.normalTint;
    }

    static createButtonTexture (options : ButtonTextureOptions) : PIXI.Texture {
        // Render a gaphic to a texture
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.lineStyle(1.5, 0x000000);
        graphics.drawRect(0, 0, options.width, options.height);
        graphics.endFill();
        const texture = options.app.renderer.generateTexture(graphics);
        graphics.destroy();
        return texture;
    }
}

interface ButtonTextureOptions {
    width : number;
    height : number;
    radius : number;
    app : PIXI.Application;
}