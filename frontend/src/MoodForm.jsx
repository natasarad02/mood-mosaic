import React, { useEffect, useState } from "react";
import { getApiId } from "./config";
import { useNavigate } from "react-router-dom";

export default function MoodForm(){
    const navigate = useNavigate();
    const [apiId, setApiId] = useState(null);
    const [stage] = useState("stage")
    const [s3Images, setS3Images] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
     const [selectedDate, setSelectedDate] = useState(null);
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
   const timestamp = new Date(selectedDate).toISOString();
    const body = JSON.stringify({
      emoji: selectedImage, 
      text: text,
      date: timestamp
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
      navigate("/mosaic");
    } catch (err) {
      console.error(err);
    }
  };

  
 return (
  <div className="page-div">
    <div className="form-div" style={{ padding: "2vh" }}>
      <h2 className="form-title">Post a new mood</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label className="label">Text: </label>
          <input className="input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

         <div style={{ marginTop: "1vh" }}>
    <label className="label">Date: </label>
    <input className="input"
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      required
    />
  </div>

        <div style={{ marginTop: "1vh" }}>
          <label>Select mood image:</label>
          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
 {s3Images.map((url, i) => (
  <img className="emoji-img"
    key={i}
    src={url} // presigned URL from Flask
    alt={`mood-${i}`}
    style={{
      border: selectedImage === url ? "3px solid blue" : "1px solid gray"
    }}
    onClick={() => setSelectedImage(url)}
  />
))}
          </div>
        </div>

        <button className="btn" type="submit" style={{ marginTop: "2vh" }}>
          Post Mood
        </button>
      </form>
    </div>
    </div>
  );
}