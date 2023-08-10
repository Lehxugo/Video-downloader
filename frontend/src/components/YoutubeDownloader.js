import { useState } from "react";
import { Link } from "react-router-dom";
import backendURL from "../global";

function YoutubeDownloader () {

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [duration, setDuration] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [thumbnailURL, setThumbnailURL] = useState('');

    function handleURLInputChange (e) {
        setUrl(e.target.value);
        setErrorMessage('');
        setTitle('');
        setAuthor('');
        setDuration('');
        setThumbnailURL('');
    };

    function handleSearchClick () {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', backendURL + `/youtube-info?URL=${url}`);
        xhr.onload = function() {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                setTitle(data.title);
                setAuthor(data.author);
                setDuration(data.duration);
                setThumbnailURL(data.thumbnailURL);
                setErrorMessage('');
            } else {
                setTitle('');
                setAuthor('');
                setDuration('');
                setThumbnailURL('');
                setErrorMessage(data.message);
            }
        };
        xhr.send();
    };

    return (
        <div className="youtube-downloader-content">
            <h1 className="youtube-downloader-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/120px-YouTube_full-color_icon_%282017%29.svg.png" alt="YouTube icon"></img>
                YouTube Video Downloader
            </h1>
            <div className="search-section">
                <p>Enter a YouTube URL</p>
                <div className="search-bar">
                    <input className="search-input" type="text" placeholder="https://www.youtube.com/watch?..." value={url} onChange={handleURLInputChange}></input>
                    <button className="search-button" onClick={handleSearchClick}>Search</button>
                </div>
            </div>
            {errorMessage !== '' ? <p className="error-message">{errorMessage}</p> : <></>}
            {title !== '' ?
                <div className="video-info">
                    {thumbnailURL !== '' ? <img src={thumbnailURL} alt={title} className="video-thumbnail"></img> : <></>}
                    <div className="video-details">
                        <h2>{title}</h2>
                        <p>{author}</p>
                        <p>{Math.floor(duration/60)}:{duration%60}</p>
                        {title !== '' ? <Link to={backendURL + `/youtube-download?URL=${url}`} className="download-button">Download</Link> : <></>}
                    </div>
                </div>
                :
                <></>
            }
        </div>
    );
}

export default YoutubeDownloader;