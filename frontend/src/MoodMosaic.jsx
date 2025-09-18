import React, { useEffect, useState } from "react";

export default function MoodMosaic() {
  const [moods, setMoods] = useState([]);

  const apiId = "bzyibylzxv"; // replace with your actual API ID
  const stage = "stage";

  useEffect(() => {
      const url = `http://localhost:4566/restapis/${apiId}/${stage}/_user_request_/moods`;

    fetch(url) // your backend endpoint
      .then((res) => res.json())
      .then((data) => setMoods(data))
      .catch(console.error);
  }, []);

  // Optional: Assign colors based on emoji
  const getColor = (emoji) => {
    switch (emoji) {
      case ":)":
        return "#FFD700"; // yellow
      case ":D":
        return "#00FF00"; // green
      case ":(":
        return "#FF6347"; // red
      default:
        return "#87CEEB"; // blue-ish
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: "10px",
        padding: "20px",
      }}
    >
      {moods.map((mood) => (
        <div
          key={mood.id}
          style={{
            backgroundColor: getColor(mood.emoji),
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          {mood.emoji}
        </div>
      ))}
    </div>
  );
}
