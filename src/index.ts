import { BodyPix, load as loadBodyPix } from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-core";
import AbstractEffect from "./AbstractEffect";
import BlurEffect, { BlurEffectSettings } from "./BlurEffect";



export class ApiVideoMediaStreamPersonSegmentation {
    private inputStream: MediaStream;
    private outputStream: MediaStream;
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private effect: AbstractEffect | null = null;
    private bodyPix: BodyPix | null = null;
    private bodyPixPromise: Promise<BodyPix> | null = null;

    constructor(mediaStream: MediaStream) {
        this.inputStream = mediaStream;
        this.video = document.createElement("video");

        const { width, height, frameRate } = mediaStream.getVideoTracks()[0].getSettings();


        this.video.width = width!;
        this.video.muted = true;
        this.video.height = height!;
        this.video.srcObject = mediaStream;
        this.video.play();

        // convert video to canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = width!;
        this.canvas.height = height!;


        this.canvas.getContext("2d"); // required by Firefox

        this.outputStream = this.canvas.captureStream(frameRate);

        this.inputStream.getAudioTracks().forEach(audio => {
            this.outputStream.addTrack(audio);
        });

        this.bodyPixPromise = loadBodyPix({
            architecture: "MobileNetV1",
            outputStride: 8,
            multiplier: 0.50,
        });
        this.bodyPixPromise.then((net: BodyPix) => {
            this.bodyPix = net;
        });

        this.drawMask();
    }

    public applyBlurEffect(settings?: BlurEffectSettings) {
        if(this.effect?.constructor.name === "BlurEffect") {
            (this.effect as BlurEffect).updateParams(settings!);
            return;
        }
        this.effect = new BlurEffect(settings);
    }

    private async drawMask() {
        if(this.effect && this.bodyPix) {
            await this.effect.applyEffect(this.bodyPix, this.canvas, this.video);
        } else {
            this.canvas.getContext("2d")!.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        }
        requestAnimationFrame(() => this.drawMask());
    };

    public onReady(callback: (outputStream: MediaStream) => void) {
        if(this.bodyPixPromise) {
            this.bodyPixPromise.then(() => {
                callback(this.outputStream);
            });
        } else {
            callback(this.outputStream);
        }
    }


    public getResultStream(): MediaStream {
        return this.outputStream;
    }

}

export { BlurEffect };
