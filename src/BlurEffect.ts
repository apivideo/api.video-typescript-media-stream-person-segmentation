import { BodyPix, drawBokehEffect } from "@tensorflow-models/body-pix";
import AbstractEffect from "./AbstractEffect";

export type BlurEffectSettings = {
    backgroundBlurAmount?: number,
    edgeBlurAmount?: number
}

export default class BlurEffect implements AbstractEffect {
    private backgroundBlurAmount: number;
    private edgeBlurAmount: number;

    constructor(params?: BlurEffectSettings) {
        this.backgroundBlurAmount = params?.backgroundBlurAmount || 5;
        this.edgeBlurAmount = params?.edgeBlurAmount || 1;
    }

    async applyEffect(bodyPix: BodyPix, canvas: HTMLCanvasElement, video: HTMLVideoElement) {
        const segmentation = await bodyPix.segmentPerson(video);
        drawBokehEffect(canvas, video, segmentation, this.backgroundBlurAmount, this.edgeBlurAmount, false)
    }

    public updateParams(params: BlurEffectSettings) {
        this.backgroundBlurAmount = params.backgroundBlurAmount || this.backgroundBlurAmount;
        this.edgeBlurAmount = params.edgeBlurAmount || this.edgeBlurAmount;
    }
}