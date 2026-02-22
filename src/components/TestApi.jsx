import { useEffect, useState } from "react";

export default function TestApi() {
  const [message, setMessage] = useState("...Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHello() {
      try {
        setError("");
        const res = await fetch("http://localhost:3000/api/hello");

        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }

        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        setError(err.message || "Unknown error");
        setMessage("");
      }
    }

    fetchHello();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>/test_api</h2>

      {error ? (
        <p style={{ color: "crimson" }}>Error: {error}</p>
      ) : (
        <p>Message: {message}</p>
      )}
    </div>
  );
}