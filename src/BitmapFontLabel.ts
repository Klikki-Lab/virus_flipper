export class BitmapFontLabel extends g.Label {

    protected static readonly DEFAULT_FONT_SIZE = 64;

    constructor(scene: g.Scene, text: string = "", fontSize: number = BitmapFontLabel.DEFAULT_FONT_SIZE) {

        const glyph = JSON.parse(scene.asset.getTextById("font_glyphs").data);
        const bitmapFont = new g.BitmapFont({
            src: scene.asset.getImageById("bitmap_font"),
            map: glyph.map,
            defaultGlyphWidth: glyph.width,
            defaultGlyphHeight: glyph.height,
            missingGlyph: glyph.missingGlyph
        });
        super({
            scene: scene,
            text: text,
            font: bitmapFont,
            fontSize: fontSize,
        });
    }
}