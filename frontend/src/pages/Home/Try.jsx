import React from "react";

const Try = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        padding: "20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ⟵
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ⟶
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #444",
            backgroundColor: "#333",
            color: "#fff",
            flex: 1,
            maxWidth: "600px",
          }}
        />
      </div>

      {/* Featured Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>WICKED</h1>
          <p style={{ margin: "10px 0", fontSize: "1rem", lineHeight: "1.6" }}>
            In the land of Oz, ostracized and misunderstood green-skinned
            Elphaba is forced to share a room with the popular aristocrat Glinda
            at Shiz University, and the two's unlikely friendship is tested as
            they begin to fulfill their respective destinies as Glinda the Good
            and the Wicked Witch of the West.
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Watch Now
            </button>
            <button
              style={{
                padding: "10px 20px",
                border: "1px solid #4CAF50",
                borderRadius: "5px",
                backgroundColor: "transparent",
                color: "#4CAF50",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>
        <div
          style={{
            flexShrink: 0,
            width: "250px",
            height: "350px",
            backgroundColor: "#4CAF50",
            borderRadius: "10px",
          }}
        ></div>
      </div>

      {/* Trending Manga Section */}
      <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>
        Trending Manga
      </h2>
      <div
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "scroll",
          paddingBottom: "10px",
        }}
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            style={{
              width: "130px",
              height: "180px",
              backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
              borderRadius: "10px",
              flexShrink: 0,
            }}
          ></div>
        ))}
      </div>

      {/* Trending Movies Section */}
      <h2 style={{ margin: "40px 0 20px", fontSize: "1.8rem" }}>
        Trending Movies
      </h2>
      <div
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "scroll",
          paddingBottom: "10px",
        }}
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            style={{
              width: "130px",
              height: "180px",
              backgroundColor: `hsl(${index * 60 + 30}, 70%, 60%)`,
              borderRadius: "10px",
              flexShrink: 0,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Try;
