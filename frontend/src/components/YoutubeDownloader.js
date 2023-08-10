import { useState } from "react";
import { Link } from "react-router-dom";
import backendURL from "../global";

function YoutubeDownloader () {

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [duration, setDuration] = useState('');
    const [message, setMessage] = useState('');

    function handleURLInputChange (e) {
        setUrl(e.target.value);
        setMessage('');
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
            } else {
                setTitle('');
                setAuthor('');
                setDuration('');
                setMessage(data.message);
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
            <p>{title}</p>
            <p>{author}</p>
            <p>{duration}</p>
            <p style={{color: 'red'}}>{message}</p>
            {title !== '' ? <Link to={backendURL + `/youtube-download?URL=${url}`}>Download</Link> : <></>}
        </>
    );
}

export default YoutubeDownloader;