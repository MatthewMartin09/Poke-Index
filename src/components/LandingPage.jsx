import React, { useState } from "react";
import "../assets/museomoderno.css";
import { useNavigate } from "react-router-dom";
import pokeindexLogo from "../assets/pokeindex_logo.png";
import pokeballBg from "../assets/pokeball-bg.png";

// Remove default body/html margin and set 100% height/width to prevent white borders
const globalStyle = `
    html, body, #root {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        background: none;
        box-sizing: border-box;
        overflow-x: hidden;
    }

    @keyframes bounce {
        0% {
            transform: scale(1) translateY(0px) rotate(0deg);
        }
        20% {
            transform: scale(1.1) translateY(-8px) rotate(-1deg);
        }
        40% {
            transform: scale(1.05) translateY(-4px) rotate(0.5deg);
        }
        60% {
            transform: scale(1.08) translateY(-6px) rotate(-0.5deg);
        }
        80% {
            transform: scale(1.03) translateY(-2px) rotate(0.2deg);
        }
        100% {
            transform: scale(1.05) translateY(-2px) rotate(1deg);
        }
    }

    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 2px 0 #cc7700, 0 4px 12px #0002, 0 0 0 0 rgba(255, 204, 51, 0.4);
        }
        50% {
            box-shadow: 0 2px 0 #cc7700, 0 4px 12px #0002, 0 0 0 10px rgba(255, 204, 51, 0);
        }
    }
`;

const LandingPage = () => {
    const navigate = useNavigate();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleExploreClick = () => {
        setIsNavigating(true);
        // Add a small delay for the animation to be visible
        setTimeout(() => {
            navigate("/login");
        }, 600); // 600ms delay to show the animation
    };

    return (
        <>
            <style>{globalStyle}</style>
            <div
                style={{
                    minHeight: "100vh",
                    width: "100vw",
                    position: "relative",
                    overflow: "hidden",
                    background: `#fff url(${pokeballBg}) center center / cover no-repeat`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100vw",
                        height: "100vh",
                        background: `url(${pokeballBg}) center center / cover no-repeat`,
                        opacity: 0.12,
                        zIndex: 0,
                    }}
                    aria-hidden="true"
                />
                <div
                    style={{
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        marginTop: "-32px",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: 'MuseoModerno, sans-serif',
                            fontWeight: 900,
                            fontSize: "1.5rem",
                            color: "#888",
                            marginBottom: "0.7rem",
                            textAlign: "center",
                            textShadow: "0 1px 0 #fff, 0 2px 4px #bbb",
                            letterSpacing: "0.02em",
                        }}
                    >
                        Welcome Player!
                    </h1>
                    <img
                        src={pokeindexLogo}
                        alt="PokeIndex Logo"
                        style={{
                            width: "min(320px, 80vw)",
                            maxWidth: "90vw",
                            marginBottom: "2.5rem",
                            display: "block",
                            filter: "drop-shadow(0 2px 0 #fff) drop-shadow(0 4px 8px #2d2d2d33)",
                        }}
                    />
                    <button
                        style={{
                            background: isNavigating 
                                ? "linear-gradient(180deg, #ffcc33 0%, #ff9900 100%)" 
                                : "linear-gradient(180deg, #ffe066 0%, #ffd000 100%)",
                            color: "#fff",
                            fontFamily: 'MuseoModerno, sans-serif',
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            border: "none",
                            borderRadius: "999px",
                            padding: "0.9rem 2.5rem",
                            boxShadow: isNavigating 
                                ? "0 2px 0 #cc7700, 0 4px 12px #0002, 0 0 0 0 rgba(255, 204, 51, 0.4)" 
                                : "0 4px 0 #e6b800, 0 2px 8px #0001",
                            cursor: isNavigating ? "wait" : "pointer",
                            marginTop: "0.5rem",
                            transition: isNavigating 
                                ? "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                                : "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.15s ease",
                            outline: "none",
                            minWidth: "140px",
                            maxWidth: "260px",
                            width: "100%",
                            boxSizing: "border-box",
                            marginLeft: "auto",
                            marginRight: "auto",
                            paddingLeft: "min(1.2rem, 4vw)",
                            paddingRight: "min(1.2rem, 4vw)",
                            transform: isNavigating 
                                ? "scale(1.05) translateY(-2px) rotate(1deg)" 
                                : "scale(1) translateY(0px) rotate(0deg)",
                            opacity: isNavigating ? 0.9 : 1,
                            animation: isNavigating ? "bounce 0.6s ease-out, pulse 1.5s infinite" : "none",
                        }}
                        onClick={handleExploreClick}
                        disabled={isNavigating}
                        onMouseDown={e => !isNavigating && (e.currentTarget.style.transform = 'scale(0.97)')}
                        onMouseUp={e => !isNavigating && (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={e => !isNavigating && (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        {isNavigating ? "Loading..." : "Explore"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
