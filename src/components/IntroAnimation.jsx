import { useEffect, useState } from "react";

function IntroAnimation() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  if (!showIntro) return null;

  return (
    <div className="intro-screen">
      <div className="intro-logo">
        <span>S</span>
        <span>T</span>
        <span>R</span>
        <span>E</span>
        <span>A</span>
        <span>M</span>
        <span>F</span>
        <span>L</span>
        <span>I</span>
        <span>X</span>
      </div>

      <div className="intro-line"></div>
    </div>
  );
}

export default IntroAnimation;