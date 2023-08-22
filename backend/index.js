const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const { error } = require('console');
const https = require('https');


const app = express();

app.use(cors());

app.listen(3001, () => {
    console.log('Server Works !!! At port 3001');
});

/* Endpoint to get the basic information of the YouTube video */
app.get('/youtube-info', async function(req,res) {
    try {
        var url = req.query.URL;

        let author = "unknown";
        let title = "unknown";
        let duration = 0;
        let thumbnailURL = "";

        await ytdl.getInfo(url).then(info => {
            author = info.videoDetails.author.name;
            title = info.videoDetails.title;
            duration = info.videoDetails.lengthSeconds;
            // The last thumbnail of the array is the one with the max resolution
            let thumbnails = info.videoDetails.thumbnails;
            if (thumbnails.length > 0) thumbnailURL = thumbnails[thumbnails.length - 1].url;
        });

        res.status(200);
        res.json({'title': title, 'author': author, 'duration': duration, 'thumbnailURL': thumbnailURL});
    } catch {
        res.status(404);
        res.json({'message': 'The video was not found'});
    }
});

/* Endpoint to download the YouTube video */
/* To download the video, this endpoint should be called through a href, for example:                   */
/* - <a href='http://localhost:3001/youtube-download?URL=https:/youtube.com/watch/...'></a>             */
/* - window.location.href = 'http://localhost:3001/youtube-download?URL=https:/youtube.com/watch/...'   */
app.get('/youtube-download', async function(req,res) {
    try {
        var url = req.query.URL;

        let finalFileName = 'final.mp4';
        // We will use the id in case the video is a YouTube Short, because Shorts can only be downloaded through video ID, not URL.
        let videoID = '';

        // Get the video ID and title for the final file name
        await ytdl.getInfo(url).then(info => {
            videoID = info.videoDetails.videoId;
            const todayDate = new Date();
            // File name = video title without characters that are not a-z / A-Z / 0-9 + current date
            finalFileName = info.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, '').split(" ").join("_") + `_${todayDate.getDate()}${todayDate.getMonth() + 1}${todayDate.getFullYear()}` + ".mp4";
        })

        // YouTube Short case
        if (url.startsWith("https://www.youtube.com/shorts/")){
            // With Shorts, video and audio are downloaded in the same Readable Stream
            let stream = ytdl(videoID, { quality: 'highest'}).pipe(fs.createWriteStream(finalFileName));
            stream.on('finish', () => {
                res.download(`./${finalFileName}`, async function () {
                    // After downloading the file in the client's side, delete the file
                    await fs.promises.unlink(path.join(__dirname, `./${finalFileName}`));
                });
            });
        
        // Normal video case
        } else {
            // Download both video and audio streams, both are Readable Stream
            let video = ytdl(url, {filter: 'videoonly', quality: 'highest'});
            let audio = ytdl(url, { filter: 'audioonly', quality: 'highest'});
        
            // Using ffmpeg to merge video and audio
            let ffmpegProcess = cp.spawn(ffmpeg, [
                // Supress non-crucial messages
                '-loglevel', '8', '-hide_banner',
                // Input audio and video by pipe
                '-i', 'pipe:3', '-i', 'pipe:4',
                // Map video from first input and audio from second
                '-map', '0:v', '-map', '1:a',
                '-c:v', 'copy', '-c:a', 'aac',
                // Output to mp4 file
                `${finalFileName}`
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

            // Wait until merging finishes, then send the file as an attachment
            ffmpegProcess.on('exit', function() {
                res.download(`./${finalFileName}`, async function () {
                    // After downloading the file in the client's side, delete the file
                    await fs.promises.unlink(path.join(__dirname, `./${finalFileName}`));
                });
            });
        }
    } catch {
        res.status(500);
        res.json({'message': 'The video could not be downloaded, please try again in 10 minutes'});
    }
});

/* Endpoint to get the basic information of the Reddit video */
app.get('/reddit-info', async function(req,res) {
    try {
        var url = req.query.URL;

        // Check if the URL belongs to a Reddit video 
        if (url.startsWith("https://www.reddit.com/r/")) {
            if (url.endsWith('/')) url = url.slice(0, -1);
            url += ".json";

            await fetch(url).then(res => res.json())
                            .then(data => {
                                const videoInfo = data[0]["data"]["children"][0]["data"];
                                res.status(200);
                                res.json({'title': videoInfo["title"], 'subreddit': videoInfo["subreddit_name_prefixed"], 'thumbnailURL': videoInfo["thumbnail"].replaceAll('amp;', '')});
                            })
                            .catch(error => {
                                res.status(404);
                                res.json({'message': 'The video does not exist.'})
                            });
        } else {
            res.status(404);
            res.json({'message': 'This URL does not belong to a Reddit video'});
        }
    } catch {
        res.status(500);
        res.json({'message': 'There\'s been a problem retrieving the video info, please try again in 10 minutes'});
    }
});


/* Endpoint to download the Reddit video */
/* To download the video, this endpoint should be called through a href, for example:                   */
/* - <a href='http://localhost:3001/reddit-download?URL=https://www.reddit.com/r...'></a>             */
/* - window.location.href = 'http://localhost:3001/reddit-download?URL=https://www.reddit.com/r...'   */
app.get('/reddit-download', async function(req,res) {
    try {
        var url = req.query.URL;

        // Check if the URL belongs to a Reddit video 
        if (url.startsWith("https://www.reddit.com/r/")) {
            if (url.endsWith('/')) url = url.slice(0, -1);
            url += ".json";

            await fetch(url).then(res => res.json())
                            .then(data => {
                                // Scrap video info
                                const videoInfo = data[0]["data"]["children"][0]["data"];
                                const todayDate = new Date();
                                const finalFileName = videoInfo.title.replace(/[^a-zA-Z0-9 ]/g, '').split(" ").join("_") + `_${todayDate.getDate()}${todayDate.getMonth() + 1}${todayDate.getFullYear()}` + ".mp4";
                                const videoStreamURL = videoInfo["secure_media"]["reddit_video"]["fallback_url"];
                                const audioStreamURL = videoInfo["url"] + "/DASH_AUDIO_128.mp4";

                                // Using ffmpeg to merge video and audio
                                let ffmpegProcess = cp.spawn(ffmpeg, [
                                    // Supress non-crucial messages
                                    '-loglevel', '8', '-hide_banner',
                                    // Input audio and video by pipe
                                    '-i', 'pipe:3', '-i', 'pipe:4',
                                    // Map video from first input and audio from second
                                    '-map', '0:v', '-map', '1:a',
                                    '-c:v', 'copy', '-c:a', 'aac',
                                    // Output to mp4 file
                                    `${finalFileName}`
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
                                https.get(videoStreamURL, (stream) => {
                                    stream.pipe(ffmpegProcess.stdio[3]);
                                });
                                https.get(audioStreamURL, (stream) => {
                                    stream.pipe(ffmpegProcess.stdio[4]);
                                });

                                // Wait until merging finishes, then send the file as an attachment
                                ffmpegProcess.on('exit', function() {
                                    res.download(`./${finalFileName}`, async function () {
                                        // After downloading the file in the client's side, delete the file
                                        await fs.promises.unlink(path.join(__dirname, `./${finalFileName}`));
                                    });
                                });
                            });
        } else {
            res.status(404);
            res.json({'message': 'This URL does not belong to a Reddit video'});
        }
    } catch {
        res.status(500);
        res.json({'message': 'The video could not be downloaded, please try again in 10 minutes'});
    }
});