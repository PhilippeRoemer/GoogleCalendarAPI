import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [events, setEvent] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const [startDate, setStartDate] = useState(new Date());

  var gapi = window.gapi;
  var CLIENT_ID = "ENTER CLIENT ID HERE";
  var API_KEY = "ENTER API KEY HERE";
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",];
  var SCOPES = "https://www.googleapis.com/auth/calendar.events";

  /* GET ALL GOOGLE CALENDAR EVENTS */
  const getGoogleCalEvents = () => {
    gapi.load("client:auth2", () => {

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.auth2
        .getAuthInstance()
        .then(() => {
          /* GET ALL EVENTS */
          gapi.client.calendar.events
            .list({
              calendarId: "primary",
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

          /* GET ALL BIRTHDAYS */
          gapi.client.calendar.events
            .list({
              calendarId: "addressbook#contacts@group.v.calendar.google.com",
              showDeleted: false,
              singleEvents: true,
              maxResults: 250,
              orderBy: "startTime",
            })
            .then((response) => {
              console.log(response);
              const birthdayEvent = response.result.items;
              console.log("BIRTHDAY EVENTS: ", birthdayEvent);
              setBirthdays(birthdayEvent);
            });

          var request = gapi.client.calendar.events.insert({
            calendarId: "primary",
          });

          request.execute((event) => {
            window.open(event.htmlLink);
          });

          /* GET ALL HOLIDAYS */
          gapi.client.calendar.events
            .list({
              calendarId: "en.usa#holiday@group.v.calendar.google.com",
              showDeleted: false,
              singleEvents: true,
              maxResults: 10,
              orderBy: "startTime",
            })
            .then((response) => {
              console.log(response);
              const holidayEvent = response.result.items;
              console.log("HOLIDAY EVENTS: ", holidayEvent);
              setHolidays(holidayEvent);
            });

          request.execute((event) => {
            window.open(event.htmlLink);
          });
        });
    });
  };

  /* ADD EVENT TO GOOGLE CALENDAR */
  const addGoogleCalEvent = () => {
    const summary = document.getElementById("inputSummary").value;
    const location = document.getElementById("inputLocation").value;
    const description = document.getElementById("inputDescription").value;

    const date = document.getElementById("date").value;
    const dateSplit = date.split("/");

    const day = dateSplit[1];
    const month = dateSplit[0];
    const year = dateSplit[2];
    const fullDate = year + "-" + month + "-" + day;

    gapi.load("client:auth2", () => {
      console.log("loaded client");

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.auth2
        .getAuthInstance()
        .then(() => {
          var event = {
            summary: summary,
            location: location,
            description: description,
            start: {
              date: fullDate,
            },
            end: {
              date: fullDate,
            },

            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          };

          var request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });

          request.execute((event) => {
            console.log(event);
            window.open(event.htmlLink);
          });
        });
    });
  };

  const removeGoogleCalEvent = (e) => {
    const ID = e.target.id;

    gapi.load("client:auth2", () => {

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.auth2.getAuthInstance().then(() => {
        var request = gapi.client.calendar.events.delete({
          calendarId: "primary",
          eventId: ID,
        });

        request.execute((event) => {
          console.log(event);
        });
      });
    });
  };

  return (
    <div className="App">
      <div className="cal">
        <div className="calAddEvent">
          <h1>Add Event</h1>
          <p>Date</p>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            id="date"
          />
          <p>Summary</p>
          <input type="text" id="inputSummary" size="20" />
          <p>Location</p>
          <input type="text" id="inputLocation" size="20" />
          <p>Description</p>
          <input type="text" id="inputDescription" size="20" />
          <br />
          <button
            style={{ width: 100, height: 50 }}
            onClick={addGoogleCalEvent}
            className="addEventButton"
          >
            Add Event
          </button>
        </div>
        <br />
        <div className="getEventsButton">
          <button
            style={{ width: 100, height: 50 }}
            onClick={getGoogleCalEvents}
          >
            Get Events
          </button>
        </div>
        <div className="calEvents">
          <div>
            <h1>Events</h1>
            {events.map((event) => {
              const eventTitle = event.summary;
              const eventDate = event.start.date;
              const eventDateTime = event.start.dateTime;
              const eventID = event.id;
              return (
                <div className="event">
                  <p className="eventTitle">{eventTitle}</p>
                  <p>{eventDate}</p>
                  <p>{eventDateTime}</p>
                  <p>{eventID}</p>

                  <button onClick={removeGoogleCalEvent} id={eventID}>
                    Remove Event
                  </button>
                </div>
              );
            })}
          </div>
          <div>
            <h1>Birthdays</h1>
            {birthdays.map((birthday) => {
              const birthdayTitle = birthday.summary;
              const birthdayDate = birthday.start.date;
              return (
                <div>
                  <p>{birthdayTitle}</p>
                  <p>{birthdayDate} </p>
                </div>
              );
            })}
          </div>
          <div>
            <h1>Holidays</h1>
            {holidays.map((holiday) => {
              const holidayTitle = holiday.summary;
              const holidayDate = holiday.start.date;
              return (
                <div>
                  <p>{holidayTitle}</p>
                  <p>{holidayDate}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
