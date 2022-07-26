import React, {useEffect, useState} from "react";
import "../css/profile.css";
import {Link, Redirect, useParams} from "react-router-dom";

export default function Person() {
    const { page } = useParams();
    const { id } = useParams();
    const i = parseInt(id, 10);
    const p = parseInt(page, 10);
    const [person, setPerson] = useState();

    const checkPersonId = () => {
        // Checks if user exists (We know that we render 0-19 users per page)
        if (i < 0 || i > 19) {
            return window.location.replace('/profile/' + p);
        }
    }

    // Get data from the profile
    const getProfileData = async () => {
        // API fetch, get the viewed profile
        try {
            const response = await fetch(
                "https://randomuser.me/api/?nat=NL&page=" + p + "&results=20&seed=app"
            ).then((response) => response.json());

            // Set all profiles in alphabetical order
            const data = response.results.sort(function (a, b) {
                return a.name.first.localeCompare(b.name.first);
            });

            // Get the person
            data.map((person, id) => {
                if (id === i) {
                    return setPerson(person);
                }
            })
        } catch (e) {
            console.log(e);
        }
    }

    // Apply functions
    useEffect(() => {
        checkPersonId();
        getProfileData();
    }, []);

    // If the profiles are not loaded, show a loading text
    if (!person) {
        return <div className="profile">Loadding...</div>;
    }

    return (
        <div className="profile">
            <header className="profile-header">
                <div>
                    <a className="button" href={`/profile/${p}`}>Return</a>
                </div>
                <div>
                    <h1>Profile</h1>
                </div>
                <div>
                    <button className="button">Add to favorite</button>
                </div>
            </header>

            <main className="profile-main">
                <div className="person-page">
                    <img src={person.picture.medium} alt="Profile_picture"/>
                    <h3>Name: {person.name.title} {person.name.first} {person.name.last} / Username: {person.login.username}</h3>
                    <h3>Gender: {person.gender}</h3>
                    <h3>Email: {person.email}</h3>
                    <h3>Phonenumber: {person.phone}</h3>
                    <h3>Age: {person.dob.age} / Date of Birth: {person.dob.date}</h3>
                    <h3>{person.id.name}: {person.id.value} </h3>
                    <h3>Street: {person.location.street.name} {person.location.street.number}</h3>
                    <h3>ZIP: {person.location.postcode} {person.location.city}</h3>
                    <h3>State: {person.location.state}</h3>
                </div>
            </main>
        </div>
    );
}