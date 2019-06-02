import * as PIXI from 'pixi.js';

export class TextureDrawer {
    static square (size : number, app : PIXI.Application) {
        const g = new PIXI.Graphics();
        const border = 1;
        g.beginFill(0xFFFFFF);
        g.lineStyle(border, 0x000000, 0);
        g.drawRect(0, 0, size, size);
        const texture = app.renderer.generateTexture(g, undefined, 2);
        g.destroy();
        return texture;
    }

    static circle (size : number, app : PIXI.Application) {
        const tx = size * 0.5; // translation x
        const ty = size * 0.5; // translation y
        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.lineStyle(1.5, 0x000000, 0);
        g.drawCircle(tx, ty, size * 0.5);
        const texture = app.renderer.generateTexture(g, undefined, 2);
        g.destroy();
        return texture;
    }

    static halfCircle (size : number, app : PIXI.Application) {
        const tx = size * 0.5; // translation x
        const ty = size * 0.5 + size * 0.5 * 0.5; // translation y
        const angle = { start: -Math.PI / 2, end: Math.PI/2 };
        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.lineStyle(1.5, 0x000000, 0);

        g.arc(tx, ty, size * 0.5, angle.start, angle.end);
        g.lineTo(tx, ty);
        const texture = app.renderer.generateTexture(g, undefined, 2);
        g.destroy();
        return texture;
    }

    static triangle (size : number, app : PIXI.Application) {
        // Draw a polygon to look like a triangle
        const tx = size * 0.5; // translation x
        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.lineStyle(1.5, 0x000000, 0);
        g.drawPolygon([
            tx, 0, // Starting x, y coordinates for the triangle
            size * 0.5 + tx, size,
            -size * 0.5 + tx, size,
            tx, 0
        ]);
        const texture = app.renderer.generateTexture(g, undefined, 2);
        g.destroy();
        return texture;
    }

    static heart (size : number, app : PIXI.Application) {
        // borrowed from: https://www.html5canvastutorials.com/advanced/html5-canvas-floating-hearts/
        const tx = size * 0.5; // translation x
        const ty = size; // translation y
        const rad = Math.PI / 180;

        const boxFitFactor = 0.7;
        const p = {
            x: tx,
            y: ty,
            a: -90,
            r: size * boxFitFactor
        };

        const x1 = p.x + p.r * Math.cos(p.a * rad);
        const y1 = p.y + p.r * Math.sin(p.a * rad);
        const cx1 = p.x + p.r * Math.cos((p.a + 22.5) * rad);
        const cy1 = p.y + p.r * Math.sin((p.a + 22.5) * rad);
        const cx2 = p.x + p.r * Math.cos((p.a - 22.5) * rad);
        const cy2 = p.y + p.r * Math.sin((p.a - 22.5) * rad);
        const chord = 2 * p.r * Math.sin(22.5 * rad / 2);

        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.lineStyle(1.5, 0x000000, 0);

        g.moveTo(x1, y1);
        g.arc(cx1, cy1, chord, (270 + p.a) * rad, (270 + p.a + 225) * rad);
        g.lineTo(p.x, p.y);
        g.moveTo(x1, y1);
        g.arc(cx2, cy2, chord, (90 + p.a) * rad, (90 + p.a + 135) * rad, true);
        g.lineTo(p.x, p.y);

        const texture = app.renderer.generateTexture(g, undefined, 2);
        g.destroy();
        return texture;
    }

    static arrow (size : number, app : PIXI.Application) {
        // Draw a polygon to look like an arrow
        const ty = size; // translation x

        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.lineStyle(1.5, 0x000000, 0);

        g.drawPolygon([
            0, ty, // Starting x, y coordinates for the triangle
            size, ty,
            size / 4, 0,
            size / 4 + size * 0.5 * 0.5 * 0.5, size * 0.5 + size * 0.5 * 0.5,
            0, ty
        ]);

        const texture = app.renderer.generateTexture(g, undefined, 2);
        g.destroy();
        return texture;
    }
}