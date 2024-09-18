import { Button } from "@/components/ui/button";

const ConfettiCustomShapes = () => {
const confetti = require("canvas-confetti");
  const handleClick = () => {
    const scalar = 2;
    const triangle = confetti.shapeFromPath({
      path: "M0 10 L5 0 L10 10z",
    });
    const square = confetti.shapeFromPath({
      path: "M0 0 L10 10 L0 Z",
    });
    const coin = confetti.shapeFromPath({
      path: "M5 0 A5 5 1 10 Z",
    });
    const tree = confetti.shapeFromPath({
      path: "M5 0 L10 10 L0 Z",
    });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [triangle, square, coin, tree],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <div className="relative flex items-center justify-center">
      <Button onClick={handleClick}>Trigger Shapes</Button>
    </div>
  );
}

export default ConfettiCustomShapes;
