import { Outlet, NavLink, Link } from "react-router-dom";

function NavigationBar () {
    return (
        <div className="content">
            <header className="nav-content">
                    <Link to={"/"}>
                        <h1 className="nav-title">Video Downloader</h1>
                    </Link>

                    <div className="nav-links">
                        <NavLink to={"/youtube"} className={({isActive}) => isActive ? 'youtube-nav-link youtube-nav-link-active' : 'youtube-nav-link'}>YouTube</NavLink>
                        <NavLink to={"/reddit"} className={({isActive}) => isActive ? 'reddit-nav-link reddit-nav-link-active' : 'reddit-nav-link'}>Reddit</NavLink>
                    </div>
            </header>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default NavigationBar;