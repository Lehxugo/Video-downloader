const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');


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

        await ytdl.getInfo(url).then(info => {
            author = info.videoDetails.author.name;
            title = info.videoDetails.title;
            duration = info.videoDetails.lengthSeconds;
        });

        res.status(200);
        res.json({'title': title, 'author': author, 'duration': duration});
    } catch {
        res.status(404);
        res.json({'message': 'The video does not exist'});
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
        
        // Download both video and audio streams, both are Readable Stream
        let video = ytdl(url, {filter: 'videoonly', quality: 'highest'});
        let audio = ytdl(url, { filter: 'audioonly', quality: 'highest'});

        // Get the video title for the final file name
        await ytdl.getInfo(url).then(info => {
            const todayDate = new Date();
            // File name = video title + current date
            finalFileName = info.videoDetails.title.split(" ").join("_") + `_${todayDate.getDate()}${todayDate.getMonth() + 1}${todayDate.getFullYear()}` + ".mp4";
        })

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
    } catch {
        res.status(500);
        res.json({'message': 'The video could not be downloaded, please try again in 10 minutes'});
    }
});