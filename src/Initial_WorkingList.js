import React, { useState } from "react";
import "./App.css";

function App() {
    const [eventss, setEvent] = useState([]);

    var gapi = window.gapi;
    /* 
    Update with your own Client Id and Api key 
  */
    var CLIENT_ID = "289792621955-cjp3ja8j0ujl0b9tr8ldlohibe1sqbis.apps.googleusercontent.com";
    var API_KEY = "AIzaSyAvjSYYlTNDVdB08K7sClSAj5hEHGc5bDU";
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var SCOPES = "https://www.googleapis.com/auth/calendar.events";

    const handleClick = () => {
        gapi.load("client:auth2", () => {
            console.log("loaded client");

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            });

            gapi.client.load("calendar", "v3", () => console.log("bam!"));

            gapi.auth2
                .getAuthInstance()
                .signIn()
                .then(() => {
                    //CREATE EVENT
                    /*                     var event = {
                        summary: "Awesome Event!",
                        location: "800 Howard St., San Francisco, CA 94103",
                        description: "Really great refreshments",
                        start: {
                            dateTime: "2022-04-26T13:00:00Z",
                            timeZone: "America/New_York",
                        },
                        end: {
                            dateTime: "2022-04-26T14:00:00Z",
                            timeZone: "America/New_York",
                        },
                        recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
                        attendees: [{ email: "test@example.com" }],
                        reminders: {
                            useDefault: false,
                            overrides: [
                                { method: "email", minutes: 24 * 60 },
                                { method: "popup", minutes: 10 },
                            ],
                        },
                    }; */

                    /*
            Uncomment the following block to get events
        */

                    // get events
                    gapi.client.calendar.events
                        .list({
                            calendarId: "primary",
                            /* Birthday ID */
                            /*  calendarId: "addressbook#contacts@group.v.calendar.google.com", */
                            /*      timeMin: new Date().toISOString(), */
                            showDeleted: false,
                            singleEvents: true,
                            maxResults: 10,
                            orderBy: "startTime",
                        })
                        .then((response) => {
                            console.log(response);
                            const events = response.result.items;
                            console.log("EVENTS: ", events);
                            setEvent(events);
                        });

                    var request = gapi.client.calendar.events.insert({
                        calendarId: "primary",
                        /*     resource: event, */
                    });

                    request.execute((event) => {
                        /* console.log(event); */

                        window.open(event.htmlLink);
                    });

                    /*
            Uncomment the following block to get events
        */
                    /*
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
        */
                });
        });
    };

    return (
        <div className="App">
            <header className="App-header">
                <p>Click to add event to Google Calendar</p>
                <p style={{ fontSize: 18 }}>Uncomment the get events code to get events</p>
                <p style={{ fontSize: 18 }}>Don't forget to add your Client Id and Api key</p>
                <button style={{ width: 100, height: 50 }} onClick={handleClick}>
                    Add Event
                </button>
                {/*   <p>{eventss}</p> */}
                {eventss.map((coin) => {
                    const sum = coin.summary;
                    return <p>{sum}</p>;
                })}
            </header>
        </div>
    );
}

export default App;
