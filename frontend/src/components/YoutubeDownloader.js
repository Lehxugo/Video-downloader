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
                setErrorMessage(data.message);
            }
        };
        xhr.send();
    };

    return (
        <>
            <p>Enter link</p>
            <input type="text" placeholder="Enter a YouTube URL" value={url} onChange={handleURLInputChange}></input>
            <button onClick={handleSearchClick}>Search</button>
            <p>{url}</p>
            {thumbnailURL !== '' ? <img src={thumbnailURL} alt={title}></img> : <></>}
            <p>{title}</p>
            <p>{author}</p>
            <p>{duration}</p>
            <p style={{color: 'red'}}>{errorMessage}</p>
            {title !== '' ? <Link to={backendURL + `/youtube-download?URL=${url}`}>Download</Link> : <></>}
        </>
    );
}

export default YoutubeDownloader;