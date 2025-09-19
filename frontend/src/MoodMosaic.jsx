import React, { useEffect, useState } from "react";
import { getApiId } from "./config";
import { useNavigate } from "react-router-dom";
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


export default function MoodMosaic() {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
useEffect(() => {
  async function fetchMoods() {
    try {
      const apiIdRes = await getApiId(); // get API ID from Flask
      if (!apiIdRes) return;

      const stage = "stage";
      const url = `http://localhost:4566/restapis/${apiIdRes}/${stage}/_user_request_/moods`;

      const res = await fetch(url);
      const data = await res.json(); // list of moods { id, emoji, text, timestamp, image }

      // Keep only the newest mood for each day
      const moodsByDay = {};
      data.forEach((mood) => {
        const dateKey = new Date(mood.timestamp).toDateString(); // e.g., "Wed Sep 18 2025"
        if (!moodsByDay[dateKey] || new Date(mood.timestamp) > new Date(moodsByDay[dateKey].timestamp)) {
          moodsByDay[dateKey] = mood;
        }
      });

      // Convert back to array
      const newestMoods = Object.values(moodsByDay);

      setImages(newestMoods);
      console.log(newestMoods);
    } catch (err) {
      console.error("Error fetching moods:", err);
    }
  }

  fetchMoods();
}, []);

  const handleNavigateToAddMood = () => {
    navigate("/add-mood");
  };

return (
  <div style={{ padding: "20px", display: "inline-block" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px repeat(31, 40px)", // first column for month labels
        gridAutoRows: "40px",
        gap: "5px",
      }}
    >
      {/* Empty top-left corner */}
      <div></div>

      {/* Day labels 1..31 */}
      {Array.from({ length: 31 }).map((_, i) => (
        <div
          key={`day-${i}`}
          style={{
            textAlign: "center",
            fontWeight: "bold",
            lineHeight: "40px",
          }}
        >
          {i + 1}
        </div>
      ))}

      {/* Months and moods */}
      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((month, monthIndex) => (
        <React.Fragment key={month}>
          {/* Month label */}
          <div
            style={{
              textAlign: "right",
              paddingRight: "5px",
              fontWeight: "bold",
              lineHeight: "40px",
            }}
          >
            {month}
          </div>

          {/* Mood cells for each day */}
          {Array.from({ length: 31 }).map((_, dayIndex) => {
            const mood = images
              .filter((m) => {
                const d = new Date(m.timestamp);
                return d.getMonth() === monthIndex && d.getDate() === dayIndex + 1;
              })
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]; // newest mood

            return (
              <div
                key={`${monthIndex}-${dayIndex}`}
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "5px",
                  overflow: "hidden",
                  boxShadow: mood ? "0 2px 5px rgba(0,0,0,0.2)" : "none",
                  backgroundColor: mood ? "#fff" : "#f0f0f0",
                  cursor: mood ? "pointer" : "default",
                }}
                title={mood ? mood.text : ""}
              >
                {mood && (
                  <img
                    src={mood.emoji} // emoji URL
                    alt={mood.text}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}

               
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
     <button onClick={handleNavigateToAddMood}>Add new</button>
  </div>
);


}
