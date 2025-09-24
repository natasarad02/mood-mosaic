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
      const apiIdRes = await getApiId(); 
      if (!apiIdRes) return;

      const stage = "stage";
      const url = `http://localhost:4566/restapis/${apiIdRes}/${stage}/_user_request_/moods`;

      const res = await fetch(url);
      const data = await res.json(); 

      const moodsByDay = {};
      data.forEach((mood) => {
        const dateKey = new Date(mood.timestamp).toDateString(); // e.g., "Wed Sep 18 2025"
        if (!moodsByDay[dateKey] || new Date(mood.timestamp) > new Date(moodsByDay[dateKey].timestamp)) {
          moodsByDay[dateKey] = mood;
        }
      });


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
  <div className="page-div">
    <div className="calendar-div">
  <div  style={{ padding: "2vh" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "4vh repeat(31, 4vh)", 
        gridAutoRows: "4vh",
        gap: "1vh",
      }}
    >
 
      <div></div>

   
      {Array.from({ length: 31 }).map((_, i) => (
        <div
          key={`day-${i}`}
          style={{
            textAlign: "center",
            fontWeight: "bold",
            lineHeight: "4vh",
            color: "#e87800"
          
          }}
        >
          {i + 1}
        </div>
      ))}

      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((month, monthIndex) => (
        <React.Fragment key={month}>
       
          <div
            style={{
              textAlign: "right",
              paddingRight: "1vh",
              fontWeight: "bold",
              lineHeight: "4vh",
               color: "#e87800"
            }}
          >
            {month}
          </div>

      
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
                  height: "4.5vh",
                  width: "4.5vh",
                  borderRadius: "1vh",
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
    <div className="btn-div">
     <button className="btn"  onClick={handleNavigateToAddMood}>Add new</button>
 </div>
  </div>
  </div>
  </div>
);


}
