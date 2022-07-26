import React, {useEffect, useState} from "react";
import "../css/profile.css";
import {Link, Redirect, useParams} from "react-router-dom";

export default function Profile(props) {
    const { page } = useParams();
    const p = parseInt(page, 10);
    const [profiles, setProfiles] = useState();
    const [query, setQuery] = useState("");
    const [favorites, setFavorites] = useState([]);

    const checkPage = () => {
        // Checks if page number is below 1, then redirects back to page 1
        if (p < 1) {
            return window.location.replace('/profile/1');
        }
    }

    const getApiData = async () => {
        // API fetch, get all profiles
        const response = await fetch(
            "https://randomuser.me/api/?nat=NL&page=" + p + "&results=20&seed=app"
        ).then((response) => response.json());

        // Set all profiles in alphabetical order
        setProfiles(response.results.sort(function (a, b) {
            return a.name.first.localeCompare(b.name.first);
        }));
    }

    // Add profiles to your favorite list (- Did not finish, lack of time for the fixing of a storage)
    const addToFavorite = (id) => {
        setFavorites(profiles.filter(profile => profile.id.value.includes(id)));
    };

    // Apply functions
    useEffect(() => {
        checkPage();
        getApiData();
    }, []);

    // If the profiles are not loaded, show a loading text
    if (!profiles) {
        return <div className="profile">Loadding...</div>;
    }

    return (
        <div className="profile">
            <header className="profile-header">
                <div>
                    <a className="button" href={`/profile/${p - 1}`}>Previous page</a>
                </div>
                <div className="searchbar">
                    <h1>Profiles</h1>
                    <input type="text" onChange={e => setQuery(e.target.value)} placeholder="Search on first name.."/>
                </div>
                <div>
                    <a className="button" href={`/profile/${p + 1}`}>Next page</a>
                </div>
            </header>

            <main className="profile-main">
                <div className="favorite-list">
                    <div>
                        <h2>Favorite list</h2>
                    </div>
                    <div className='favorites'>
                        {favorites &&
                            favorites.map((profile, id) => (
                                <div className="profile-card" key={id}>
                                    <img src={profile.picture.thumbnail} alt="profile_picture"/>
                                    <p>{profile.name.title} {profile.name.first} {profile.name.last}</p>
                                    <p>{profile.email}</p>
                                    <div className="card-buttons">
                                        <Link to={`/profile/${p}/${id}`} className="button">View profile</Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="list">
                    {profiles &&
                        profiles.filter(profile => profile.name.first.includes(query)).map((profile, id) => (
                            <div className="profile-card" key={id}>
                                <img src={profile.picture.thumbnail} alt="profile_picture"/>
                                <p>{profile.name.title} {profile.name.first} {profile.name.last}</p>
                                <p>{profile.email}</p>
                                <div className="card-buttons">
                                    <Link to={`/profile/${p}/${id}`} className="button">View profile</Link>
                                    <button className="button" onClick={e => addToFavorite(profile.id.value)}>Add to Favorites</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </main>
        </div>
    );
}