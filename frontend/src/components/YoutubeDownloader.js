import { useState } from "react";

function YoutubeDownloader () {

    const [url, setUrl] = useState('');

    function handleURLInputChange (e) {
        setUrl(e.target.value);
    };

    function handleDownloadClick () {
        setUrl('');
    }

    return (
        <>
            <p>Enter link</p>
            <input type="text" placeholder="Enter a YouTube URL" value={url} onChange={handleURLInputChange}></input>
            <button onClick={handleDownloadClick}>Download</button>
            <p>{url}</p>
        </>
    );
}

export default YoutubeDownloader;