import { useState } from "react";
import { Link } from "react-router-dom";
import backendURL from "../global";

function RedditDownloader () {

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [subredditName, setSubredditName] = useState('');
    const [thumbnailURL, setThumbnailURL] = useState('');

    const [searchingMessage, setSearchingMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleURLInputChange (e) {
        setUrl(e.target.value);
        setErrorMessage('');
        setTitle('');
        setSubredditName('');
        setThumbnailURL('');
    };

    function handleSearchClick () {
        setSearchingMessage('Searching video...');
        const xhr = new XMLHttpRequest();
        xhr.open('GET', backendURL + `/reddit-info?URL=${url}`);
        xhr.onload = function() {
            setSearchingMessage('');
            const data = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                setTitle(data.title);
                setSubredditName(data.subreddit);
                setThumbnailURL(data.thumbnailURL);
                setErrorMessage('');
            } else {
                setTitle('');
                setSubredditName('');
                setThumbnailURL('');
                setErrorMessage(data.message);
            }
        };
        xhr.send();
    };

    return (
        <div className="downloader-content">
            <h1 className="downloader-header">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/1200px-Reddit_Logo_Icon.svg.png" alt="Reddit icon"></img>
                Reddit Video Downloader
            </h1>
            <div className="search-section">
                <p>Enter a Reddit video URL</p>
                <div className="search-bar">
                    <input className="search-input" type="text" placeholder="https://www.reddit.com/r/..." value={url} onChange={handleURLInputChange}></input>
                    <button className="search-button" onClick={handleSearchClick}>Search</button>
                </div>
            </div>
            {errorMessage !== '' ? <p className="error-message">{errorMessage}</p> : <></>}
            {searchingMessage !== '' ? <p>{searchingMessage}</p> : <></>}
            {title !== '' ?
                <div className="video-info">
                    {thumbnailURL !== '' ? <img src={thumbnailURL} alt={title} className="video-thumbnail"></img> : <></>}
                    <div className="video-details">
                        <h2>{title}</h2>
                        <p>{subredditName}</p>
                        {title !== '' ? <Link to={backendURL + `/youtube-download?URL=${url}`} className="download-button">Download</Link> : <></>}
                    </div>
                </div>
                :
                <></>
            }
        </div>
    );
}

export default RedditDownloader;