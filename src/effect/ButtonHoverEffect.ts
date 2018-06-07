module view {
    export enum HoverType {
        type1
    }

    export class ButtonHoverEffect {

        public static onHover(type: HoverType, tweenObj: PIXI.DisplayObject, isOverIn: boolean) {

            switch (type) {
                case HoverType.type1:
                    ButtonHoverEffect.alphaVisible(tweenObj, isOverIn);
                    break;

            }

        }


        private static alphaVisible(tweenObj: PIXI.DisplayObject, isOverIn: boolean) {
            let sec = 0.5;
            TweenLite.killTweensOf(tweenObj);

            if (isOverIn) {
                TweenLite.to(tweenObj, sec, { alpha: 1 });
            } else {
                TweenLite.to(tweenObj, sec, { alpha: 0, onComplete: () => { tweenObj.visible = false } });
            }

        }

    }
}