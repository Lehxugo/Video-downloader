const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());

app.listen(3001, () => {
    console.log('Server Works !!! At port 3001');
});

app.get('/youtube-download', (req,res) => {
    var URL = req.query.URL;
    
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    
    ytdl(URL, {
        format: 'mp4'
    }).pipe(res);
});