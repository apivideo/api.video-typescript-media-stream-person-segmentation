[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video)
&nbsp; [![badge](https://img.shields.io/github/stars/apivideo/api.video-typescript-media-stream-person-segmentation?style=social)](https://github.com/apivideo/api.video-typescript-media-stream-person-segmentation)
&nbsp; [![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)
![](https://github.com/apivideo/.github/blob/main/assets/apivideo_banner.png)
<h1 align="center">Mediastream person segmentation</h1>

[api.video](https://api.video) is the video infrastructure for product builders. Lightning fast
video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in
your app.

# Table of contents

- [Table of contents](#table-of-contents)
- [Project description](#project-description)
- [Getting started](#getting-started)
  - [Installation](#installation)
    - [Simple include in a javascript project](#simple-include-in-a-javascript-project)
- [Documentation](#documentation)
  - [Instanciation](#instanciation)
    - [Options](#options)
  - [Methods](#methods)
    - [`applyBlurEffect(options: BlurEffectOptions)`](#applyblureffectoptions-blureffectoptions)
      - [Options](#options-1)
    - [`onReady(callback: (stream: MediaStream) => void)`](#onreadycallback-stream-mediastream--void)
- [Full example](#full-example)

# Project description

This library allows you to easily blur the background of a webcam video stream in real-time using TensorFlow.

With this library, you can create a more professional and visually appealing video conferencing experience by keeping the focus on the person in front of the camera and reducing visual distractions from the surrounding environment.

Please note that this project is currently experimental and may not be suitable for production use. This works pretty well on Chrome and Firefox, it may not work as well on Safari.

# Getting started

## Installation


### Simple include in a javascript project

Include the library in your HTML file like so:

```html
<head>
    ...
    <script src="https://unpkg.com/@api.video/media-stream-person-segmentation" defer></script>
</head>
```


```html
...
<script type="text/javascript"> 
    navigator.mediaDevices.getUserMedia(constraints).then((webcamStream) => {
        const segmentation = new ApiVideoMediaStreamPersonSegmentation(webcamStream)

        segmentation.applyBlurEffect()

        segmentation.onReady((ouputStream) => {
            // use the ouputStream to display the video
            // ...
        });

    });
</script>
```

# Documentation

## Instanciation

### Options 

The library is instanciated with a MediaStream object as parameter.

```javascript
const segmentation = new ApiVideoMediaStreamPersonSegmentation(webcamStream)
```

## Methods

### `applyBlurEffect(options: BlurEffectOptions)`

Apply a blur effect on the background of the video stream.

#### Options

| Name | Default | Type | Description |
| :------ | :------| :------ | :------ |
| backgroundBlurAmount | 15 | number | The amount of blur to apply to the background. |
| edgeBlurAmount | 8 | number | The amount of blur to apply to the edges of the person. |

```javascript
segmentation.applyBlurEffect({
    backgroundBlurAmount: 15,
    edgeBlurAmount: 8
})
``` 

### `onReady(callback: (stream: MediaStream) => void)`
Call the callback when the stream is ready.

```javascript
segmentation.onReady((stream) => {
    // use the stream to display the video
    // ...
});
```



# Full example


```html
<html>

<head>
    <script src="https://unpkg.com/@api.video/media-stream-person-segmentation"></script>
    <style>
        #container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #video {
            width: 640;
            height: 480;
            border: 1px solid gray;
        }

        #container div {
            margin: 10px 0;
        }

        label {
            display: inline-block;
            width: 160px;
            text-align: right;
        }

        input {
            display: inline-block;
            width: 300px;
        }
    </style>
</head>

<body>
    <div id="container">
        <div>
            <video muted id="video"></video>
        </div>
        <div>
            <div>
                <label for="blur">Blur background</label>
                <input type="range" id="blur" min="0" max="100" value="15" />
            </div>
            <div>
                <label for="blurEdges">Blur edges</label>
                <input type="range" id="blurEdges" min="0" max="10" value="8" />
            </div>
        </div>
    </div>

    <script>
        const video = document.querySelector('#video');

        var constraints = window.constraints = {
            audio: true,
            video: true
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            const segmentation = new ApiVideoMediaStreamPersonSegmentation(stream)

            segmentation.applyBlurEffect({
                backgroundBlurAmount: 15,
                edgeBlurAmount: 8
            })

            document.getElementById("blur").addEventListener("input", (e) => segmentation.applyBlurEffect({
                backgroundBlurAmount: e.target.value
            }));
            document.getElementById("blurEdges").addEventListener("input", (e) => segmentation.applyBlurEffect({
                edgeBlurAmount: e.target.value
            }));

            segmentation.onReady((stream) => {
                video.srcObject = stream;
                video.play();
            });

        });
    </script>
</body>

</html>
```
