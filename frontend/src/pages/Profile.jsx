import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({ name: "User", email: "user@gmail.com" });

  useEffect(() => {
    // Later we will fetch real user data using token
    const storedName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("user_email");

    if (storedName && storedEmail) {
      setUser({ name: storedName, email: storedEmail });
    }
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ textAlign: "center" }}>Profile 👤</h2>

      <div
        style={{
          margin: "auto",
          maxWidth: 400,
          padding: 20,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>

        <button
          onClick={() => {
            localStorage.clear();
            alert("Logged out!");
            window.location.href = "/login";
          }}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 12,
            background: "red",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
