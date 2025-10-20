'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import GameCanvas from '@/components/game/GameCanvas';
import { Button } from '@/components/ui/button';

function GameContent() {
  const searchParams = useSearchParams();
  const playerName = searchParams.get('name') || 'Anonymous';
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalLength, setFinalLength] = useState(0);

  const handleGameOver = (score: number, length: number) => {
    setFinalScore(score);
    setFinalLength(length);
    setGameOver(true);
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const handleBackHome = () => {
    window.location.href = '/';
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-card to-background border-2 border-primary rounded-2xl p-8 text-center">
            <h1 className="text-4xl font-black text-foreground mb-2 neon-text">
              GAME OVER
            </h1>
            <p className="text-muted-foreground mb-8">
              Nice run, <span className="text-primary font-bold">{playerName}</span>!
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-background/50 rounded-xl p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Final Score</div>
                <div className="text-3xl font-bold text-primary">{finalScore}</div>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Final Length</div>
                <div className="text-3xl font-bold text-secondary">{finalLength}</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
                onClick={handlePlayAgain}
              >
                PLAY AGAIN
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-border hover:bg-card font-semibold"
                onClick={handleBackHome}
              >
                BACK TO HOME
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold"
                onClick={() => window.location.href = '/leaderboard'}
              >
                VIEW LEADERBOARD
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <GameCanvas playerName={playerName} onGameOver={handleGameOver} />;
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary animate-pulse-glow" />
          <p className="text-foreground font-semibold">Loading game...</p>
        </div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
