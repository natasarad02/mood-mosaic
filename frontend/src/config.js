export async function getApiId() {
  try {
    const res = await fetch("http://localhost:5000/api/api-id");
    console.log("Raw response:", res);
    const data = await res.json();
     console.log("API ID data:", data.apiId);
    return data.apiId;
  } catch (err) {
    console.error("Failed to fetch API ID:", err);
    return null;
  }
}