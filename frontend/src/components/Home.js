import { Link } from "react-router-dom";

function Home () {
    return (
        <>
            <h1 className="home-title">Video Downloader</h1>
            <h2 className="home-subtitle">Download your favorite videos from your favorite platforms!</h2>
            <div className="downloaders">
                <div className="downloader">
                    <Link to={'youtube'} className="downloader-card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/120px-YouTube_full-color_icon_%282017%29.svg.png" alt="YouTube icon"></img>
                        <p>YouTube</p>
                    </Link>
                </div>
                <div className="downloader">
                    <Link to={'reddit'} className="downloader-card">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/1200px-Reddit_Logo_Icon.svg.png" alt="Reddit icon"></img>
                        <p>Reddit</p>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Home;