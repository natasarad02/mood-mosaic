import React, { useEffect, useState } from "react";
import { getApiId } from "./config";

export default function MoodForm(){

    const [apiId, setApiId] = useState(null);
    const [stage] = useState("stage")
    const [s3Images, setS3Images] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [text, setText] = useState("");

    useEffect(() => {
    async function fetchData() {
      try {
        const apiIdRes = await getApiId();
        setApiId(apiIdRes);

        const s3Res = await fetch("http://localhost:5000/api/s3-images");
        const images = await s3Res.json();
        setS3Images(images);
        if (images.length > 0) setSelectedImage(images[0]); // default selection
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiId) return;

    const url = `http://localhost:4566/restapis/${apiId}/${stage}/_user_request_/moods`;

    const body = JSON.stringify({
      emoji: selectedImage, 
      text: text,
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      const data = await res.json();
      console.log("Posted mood:", data);
      alert("Mood successfully posted.");
    } catch (err) {
      console.error(err);
    }
  };

  
 return (
    <div style={{ padding: "20px" }}>
      <h2>Post a new mood</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Text: </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Select mood image:</label>
          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
 {s3Images.map((url, i) => (
  <img
    key={i}
    src={url} // presigned URL from Flask
    alt={`mood-${i}`}
    style={{
      width: "80px",
      height: "80px",
      border: selectedImage === url ? "3px solid blue" : "1px solid gray",
      cursor: "pointer",
    }}
    onClick={() => setSelectedImage(url)}
  />
))}
          </div>
        </div>

        <button type="submit" style={{ marginTop: "20px" }}>
          Post Mood
        </button>
      </form>
    </div>
  );
}