import React, { useEffect, useState } from "react";
import { getApiId } from "./config";

export default function MoodMosaic() {
  const [images, setImages] = useState([]);

useEffect(() => {
  async function fetchMoods() {
    try {
      const apiIdRes = await getApiId(); // get API ID from your Flask endpoint
      if (!apiIdRes) return;

      const stage = "stage";
      const url = `http://localhost:4566/restapis/${apiIdRes}/${stage}/_user_request_/moods`;

      const res = await fetch(url);
      const data = await res.json(); // list of moods { id, emoji, text, timestamp, image }
      setImages(data); // assuming you want to display mood images
      console.log(data);
    } catch (err) {
      console.error("Error fetching moods:", err);
    }
  }

  fetchMoods();
}, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "10px",
        padding: "20px",
      }}
    >
{images.map((mood) => (
  <div
    key={mood.id}
    style={{
      height: "120px",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      cursor: "pointer",
    }}
    title={mood.text} // shows text on hover
  >
    <img
      src={mood.emoji} // emoji URL
      alt={mood.text}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
))}

    </div>
  );
}
