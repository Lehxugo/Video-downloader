
# Video Downloader

- [General information](#general-information)
- [How does YouTube Downloader work](#how-does-youtube-downloader-work)
- [How does Reddit Downloader work](#how-does-reddit-downloader-work)
- [Run Locally](#run-locally)
- [API Reference](#api-reference)

## General Information

Video Downloader is a Web App to download videos from:
- YouTube
- Reddit

To do so, Video Downloader makes use of [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static), [node-ytdl-core](https://github.com/fent/node-ytdl-core) and web scraping.
The frontend is written in React and the backend in NodeJS + Express.js.
## How does YouTube Downloader work

To download videos from YouTube I used [node-ytdl-core](https://github.com/fent/node-ytdl-core), a node module made to download from YouTube. This module does not only download videos but also allows to retrieve info and validate video URLs and IDs.

To download any video:
```
const ytdl = require('ytdl-core');

const video = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

This might seem easy, but what we got in the const *video* is not the video itself, is a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of the video data. To get a video file this Readable Stream must be piped to a file:

```
const fs = require('fs');
const ytdl = require('ytdl-core');

const video = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
video.pipe(fs.createWriteStream('video.mp4'));
```

Another problem is the way YouTube stores their videos, as video and audio are stored separately. With the default ytdl() call, [node-ytdl-core](https://github.com/fent/node-ytdl-core) only downloads the Readable Stream of the video, so after following the code above, your output file will not have any sound. To solve this we must download video and audio in two different calls:

```
const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
let video = ytdl(url, {filter: 'videoonly', quality: 'highest'});
let audio = ytdl(url, { filter: 'audioonly', quality: 'highest'});
```

Having both Readable Streams, the only thing left is merging them and pipe to an outuput file. To merge the Streams, I used [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static), this is a node module that provides the static binaries for [FFmpeg](https://ffmpeg.org/), this way we don't have to install anything on our OS. Normally FFmpeg uses files as inputs, but to save space when downloading a video we can create a Node Child Process executing the ```ffmpeg``` command and pipe audio and video Streams to it as inputs:

```
let ffmpegProcess = cp.spawn(ffmpeg, [
    // Supress non-crucial messages
    '-loglevel', '8', '-hide_banner',
    // Input audio and video by pipe
    '-i', 'pipe:3', '-i', 'pipe:4',
    // Map video from first input and audio from second
    '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac',
    // Output to mp4 file
    'video.mp4'
], {
    // No popup window for Windows users
    windowsHide: true,
    stdio: [
        // Silence stdin/out, forward stderr,
        'inherit', 'inherit', 'inherit',
        // and pipe video, audio
        'pipe', 'pipe'
    ]
});
// Input audio and video by pipe
video.pipe(ffmpegProcess.stdio[3]);
audio.pipe(ffmpegProcess.stdio[4]);
```

I wanted to do the same with the output stream, so we don't have to store the output file on the server, but if we pipe the result Stream to the response, because of the MP4 format properties we get a video with infinite duration. The only solution is to temporarily store the output file and delete it after sending it to the client:

```
ffmpegProcess.on('exit', function() {
    res.download('video.mp4', async function () {
        // After downloading the file in the client's side, delete the file
        await fs.promises.unlink(path.join(__dirname, 'video.mp4'`));
    });
});
```
## How does Reddit Downloader work
## Run Locally

Clone the project

```bash
  git clone https://github.com/Lehxugo/Video-downloader.git
```

Go to the project directory

```bash
  cd Video-downloader
```
-- **Backend** --

Go to the backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node index.js
```

-- **Frontend** --

Go to the frontend directory

```bash
  cd ..
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```
## API Reference

Backend API endpoints.

#### Get YouTube video info

```
  GET /youtube-info?URL=https:/youtube.com/watch/...
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `URL`     | `string` | **Required**. The YouTube video/Short URL |

| Response status  | Response body                |
| :-------- | :------------------------- |
| `200`     | `{title, author, duration, thumbnailURL}` |
| `404`     | `{message: 'The video was not found'}` |

#### Download YouTube video

You must call this endpoint through a hyperlink, for example:
- ```<a src="localhost:3001/youtube-download?URL=https:/youtube.com/watch/..."></a>```

```
  GET /youtube-download?URL=https:/youtube.com/watch/...
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `URL`     | `string` | **Required**. The YouTube video/Short URL |

| Response status  | Response body                |
| :-------- | :------------------------- |
| `200`     | Does not return a JSON, instead downloads the file |
| `500`     | `{'message': 'The video could not be downloaded, please try again in 10 minutes'}` |

#### Get Reddit video info

```
  GET /reddit-info?URL=https://www.reddit.com/r...
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `URL`     | `string` | **Required**. The Reddit video URL |

| Response status  | Response body                |
| :-------- | :------------------------- |
| `200`     | `{title, subreddit, thumbnailURL}` |
| `400`     | `{'message': 'This URL does not belong to a Reddit video'}` |
| `404`     | `{message: 'The video was not found'}` |
| `500`     | `{'message': 'There's been a problem retrieving the video info, please try again in 10 minutes'}` |

#### Download Reddit video

You must call this endpoint through a hyperlink, for example:
- ```<a src="localhost:3001/reddit-download?URL=https://www.reddit.com/r..."></a>```

```
  GET /reddit-download?URL=https://www.reddit.com/r...
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `URL`     | `string` | **Required**. The Reddit video URL |

| Response status  | Response body                |
| :-------- | :------------------------- |
| `200`     | Does not return a JSON, instead downloads the file |
| `400`     | `{'message': 'This URL does not belong to a Reddit video'}` |
| `500`     | `{'message': 'There's been a problem retrieving the video info, please try again in 10 minutes'}` |