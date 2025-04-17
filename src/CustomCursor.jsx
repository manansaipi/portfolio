import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      console.log(e.target.tagName);
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === "A") {
        setHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.tagName === "A") {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div
      className={`bg-primary pointer-events-none fixed w-5 h-5 ${
        hovering ? " scale-200 mix-blend-difference bg-primary" : ""
      } rounded-full transition-transform duration-200`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}
