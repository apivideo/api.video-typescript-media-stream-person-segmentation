import { BodyPix } from "@tensorflow-models/body-pix";

export default abstract class AbstractEffect {
    abstract applyEffect(net: BodyPix, canvas: HTMLCanvasElement, video: HTMLVideoElement): void;
}