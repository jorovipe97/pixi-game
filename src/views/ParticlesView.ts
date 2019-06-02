import * as PIXI from 'pixi.js';
import View from "./View";
import { Button } from '../components/button/Button';
import { MainView } from './MainView';

const fragmentShader = '\
varying vec2 vTextureCoord;\
uniform sampler2D uDiffuseSampler;\
uniform float uTime;\
void main(){\
    vec2 uv = vTextureCoord; \
    \
    vec2 n0Uv = vec2(uv.x*1.4 + 0.01, uv.y + uTime*0.69);\
    vec2 n1Uv = vec2(uv.x*0.5 - 0.033, uv.y*2.0 + uTime*0.12);\
    vec2 n2Uv = vec2(uv.x*0.94 + 0.02, uv.y*3.0 + uTime*0.61);\
    float n0 = (texture2D(uDiffuseSampler, n0Uv).w-0.5)*2.0;\
    float n1 = (texture2D(uDiffuseSampler, n1Uv).w-0.5)*2.0;\
    float n2 = (texture2D(uDiffuseSampler, n2Uv).w-0.5)*2.0;\
    float noiseA = clamp(n0 + n1 + n2, -1.0, 1.0);\
    \
    vec2 n0UvB = vec2(uv.x*0.7 - 0.01, uv.y + uTime*0.27);\
    vec2 n1UvB = vec2(uv.x*0.45 + 0.033, uv.y*1.9 + uTime*0.61);\
    vec2 n2UvB = vec2(uv.x*0.8 - 0.02, uv.y*2.5 + uTime*0.51);\
    float n0B = (texture2D(uDiffuseSampler, n0UvB).w-0.5)*2.0;\
    float n1B = (texture2D(uDiffuseSampler, n1UvB).w-0.5)*2.0;\
    float n2B = (texture2D(uDiffuseSampler, n2UvB).w-0.5)*2.0;\
    float noiseB = clamp(n0B + n1B + n2B, -1.0, 1.0);\
    \
    vec2 finalNoise = vec2(noiseA, noiseB); \
    float perturb = (1.0 - uv.y) * 0.35 + 0.02; \
    finalNoise = (finalNoise * perturb) + uv - 0.02; \
    \
    vec4 color = texture2D(uDiffuseSampler, finalNoise - 4.);\
    color = vec4(color.x*2.1, color.y*1.8, (color.y/color.x)*0.3, 1.0);\
    finalNoise = clamp(finalNoise, 0.05, 1.0);\
    color.w = texture2D(uDiffuseSampler, finalNoise).z*2.0;\
    color.w = color.w * texture2D(uDiffuseSampler, uv).z;\
    gl_FragColor = vec4(color.r*color.w, color.g*color.w, color.b*color.w, color.w);\
}\
';


//gl_FragColor = vec4(texel.x * (sin(uTime * 10.) * 0.5 + 0.5), texel.y, texel.z, 0.);\
// vec4(sin(uTime) * 0.5 + 0.5, 0., 0.0, 1.0);\
export class ParticlesView extends View {
    backButton: Button;
    backgroundSprite : PIXI.Sprite;
    /**
     * Time in seconds
     */
    private timeCounter : number = 0;
    private uniforms : any;
    private filter : PIXI.Filter<object>;
    startView() {
        // Creates a common texture.
        const buttonTexture: PIXI.Texture = Button.createButtonTexture({
            width: this.screenWidth * 0.25,
            height: this.screenHeight * 0.10,
            radius: 5,
            app: this.app
        });

        // create button1 for open test 1
        this.backButton = new Button(buttonTexture, 'Back');
        this.backButton.on('pointerup', this.onBackButton, this);

        // A tyny white texture.
        let texture = PIXI.loader.resources['images/flame.png'].texture; // PIXI.Texture.fromImage('./images/fire/flame.png', this.onComplete.bind(this));
        texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.backgroundSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.backgroundSprite.width = 800;
        this.backgroundSprite.height = 832;
        this.addChild(this.backgroundSprite);

        this.uniforms = {
            uDiffuseSampler: {
                type: 'sampler2D',
                value: texture
            },
            uTime: {
                type: 'float',
                value: 0
            }
        };
        //Create our Pixi filter using our custom shader code
        this.filter = new PIXI.Filter('', fragmentShader, this.uniforms);
        //Apply it to our object
        this.backgroundSprite.filters = [this.filter];

        this.addChild(this.backButton);
    }

    updateView() {
        // @ts-ignore
        this.filter.uniforms.uTime = this.timeCounter;
        this.timeCounter += this.app.ticker.elapsedMS / 1000;
        // console.log(this.filter.uniforms);
    }

    onResize() {
        const standardPadding = 20;
        this.backButton.x = this.screenWidth - this.backButton.width - standardPadding;
        this.backButton.y = standardPadding;

        this.backgroundSprite.x = (this.screenWidth - this.backgroundSprite.width) * 0.5;
        this.backgroundSprite.y = (this.screenHeight - this.backgroundSprite.height);
    }

    onBackButton() {
        new MainView(this.app);
        this.destroy();
    }
}