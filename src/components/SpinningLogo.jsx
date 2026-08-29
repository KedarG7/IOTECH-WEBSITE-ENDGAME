
"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs/animation";
import { createScope } from "animejs/scope";
import { createDraggable } from "animejs/draggable";
import { spring } from "animejs/easings";

function SpinningLogo() {
  const root = useRef(null);
  const scope = useRef(null);
  const [rotations, setRotations] = useState(0);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      // Logo breathing/bounce animation
      animate(".logo", {
        scale: [
          {
            to: 1.08,
            ease: "inOut(3)",
            duration: 300,
          },
          {
            to: 1,
            ease: spring({ bounce: 0.7 }),
          },
        ],
        loop: true,
        loopDelay: 500,
      });

      // Make logo draggable
      createDraggable(".logo", {
        container: [0, 0, 0, 0],
        releaseEase: spring({ bounce: 0.7 }),
      });

      // Rotation method
      self.add("rotateLogo", (rotation) => {
        animate(".logo", {
          rotate: rotation * 360,
          ease: "out(4)",
          duration: 1500,
        });
      });
    });
    // Spin logo once on initial load
    scope.current?.methods.rotateLogo(1);

    return () => {
      scope.current?.revert();
    };
  }, []);

  const handleClick = () => {
    setRotations((prev) => {
      const newRotations = prev + 1;

      scope.current?.methods.rotateLogo(newRotations);

      return newRotations;
    });
  };

  return (
    <div
      ref={root}
      className="flex items-center justify-center mb-4"
    >
      <img
        src="/Logo.png"
        alt="IOTech Logo"
        onClick={handleClick}
        draggable={false}
        className="
          logo
          h-24
          w-24
          sm:h-32
          sm:w-32
          md:h-40
          md:w-40
          cursor-pointer
          select-none
          object-contain
          hover:scale-105
        "
      />
    </div>
  );
}

export default SpinningLogo;
