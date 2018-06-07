module view {

    export class Button extends PIXI.Sprite {

        hoverType: HoverType = HoverType.type1;


        frameColor = 0xffffff;
        bgColor = 0x0011ff;

        label: PIXI.Text;
        private bgView: PIXI.Graphics;

        _buttonWidth: number;
        _buttonHeight: number;

        private effectSec = 0.5;
        private effect: PIXI.Sprite;

        private currentTween: TweenLite;

        constructor(text = "Button") {
            super();

            this.bgView = new PIXI.Graphics();

            this.effect = new PIXI.Sprite(PIXI.Texture.WHITE);
            this.effect.anchor.set(0.5);
            this.effect.visible = false;
            this.effect.alpha = 0;

            this.label = new PIXI.Text(text, { fill: this.frameColor });
            this.label.anchor.set(0.5);

            this.addChild(this.bgView, this.effect, this.label);

            this.drawNormalSytle();

            // set interactive
            this.interactive = true;
            this.buttonMode = true;
            this.on("pointerover", this.onButtonOver);
            this.on("pointerout", this.onButtonOut);
        }

        drawNormalSytle() {
            // let width = this.width;
            // let height = this.height;
            let padding = 10;
            let width = this._buttonWidth || this.label.width + padding;
            let height = this._buttonHeight || this.label.height + padding;

            // let startX =  -width * 0.5;
            // let startY = -height * 0.5;
            let startX = -width * 0.5;
            let startY = -height * 0.5;

            let graph = this.bgView;
            graph.clear();
            graph.beginFill(this.bgColor);
            // graph.drawRect(startX,startY,width,height);
            // graph.endFill();

            graph.lineStyle(5, this.frameColor);

            graph.moveTo(startX, startY);
            graph.lineTo(startX + width, startY);
            graph.lineTo(startX + width, startY + height);
            graph.lineTo(startX, startY + height);
            graph.lineTo(startX, startY);

            graph.endFill();


        }

        set buttonWidth(width: number) {
            this._buttonWidth = Math.max(width, this.label.width);
            this.redraw();
        }

        set buttonHeight(height: number) {
            this._buttonHeight = Math.max(height, this.label.height);
            this.redraw();
        }

        redraw() {
            this.drawNormalSytle();
        }

        onButtonOver() {
            this.effect.width = this._buttonWidth;
            this.effect.height = this._buttonHeight;

            this.effect.visible = true;
            this.effect.tint = this.frameColor;


            ButtonHoverEffect.onHover(this.hoverType,this.effect,true);

            this.label.style.fill = this.bgColor;
        }

        onButtonOut() {
            
            ButtonHoverEffect.onHover(this.hoverType,this.effect,false);

            this.label.style.fill = this.frameColor;
        }
    }
}