import { Outlet, NavLink, Link } from "react-router-dom";

function NavigationBar () {
    return (
        <div className="content">
            <header className="nav-content">
                    <Link to={"/"}>
                        <h1 className="nav-title">Video Downloader</h1>
                    </Link>

                    <div className="nav-links">
                        <NavLink to={"/youtube"}>YouTube</NavLink>
                        <NavLink>Instagram</NavLink>
                    </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default NavigationBar;