import { useEffect, useState } from "react";
import { Button, Text } from "@mantine/core";

export function CountDown() {
  const initialTime = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m < 10 ? "0" + m : m;
    const ss = s < 10 ? "0" + s : s;
    return `${mm}:${ss}`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Text fw={500}>{formatTime(timeLeft)}</Text>
      <Button
        size="xs"
        variant="filled"
        color="green"
        onClick={() => setIsRunning(true)}
        disabled={isRunning || timeLeft === 0}
      >
        Start
      </Button>
      <Button
        size="xs"
        variant="filled"
        color="orange"
        onClick={() => setIsRunning(false)}
        disabled={!isRunning}
      >
        Pause
      </Button>
      <Button
        size="xs"
        variant="filled"
        color="red"
        onClick={() => {
          setIsRunning(false);
          setTimeLeft(initialTime);
        }}
      >
        Reset
      </Button>
    </div>
  );
}
