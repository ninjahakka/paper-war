"use client";

import { useEffect, useRef, useState } from "react";

export default function MouseTrail() {
  const canvasRef = useRef(null);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const point = { x: e.clientX, y: e.clientY, timestamp: Date.now() };
      setTrail((prev) => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY }];
        return newTrail.length > 300 ? newTrail.slice(-300) : newTrail;
        });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      //ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      for (let i = 0; i < trail.length - 1; i++) {
        const p1 = trail[i];
        const p2 = trail[i + 1];
        ctx.strokeStyle = `rgba(150, 150, 150, 0.2)`;
        ctx.lineWidth = 4;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();
      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [trail]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
