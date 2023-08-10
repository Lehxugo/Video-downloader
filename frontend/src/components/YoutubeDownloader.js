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
            <p>{url}</p>
            {thumbnailURL !== '' ? <img src={thumbnailURL} alt={title}></img> : <></>}
            <p>{title}</p>
            <p>{author}</p>
            <p>{duration}</p>
            <p style={{color: 'red'}}>{errorMessage}</p>
            {title !== '' ? <Link to={backendURL + `/youtube-download?URL=${url}`}>Download</Link> : <></>}
        </div>
    );
}

export default YoutubeDownloader;