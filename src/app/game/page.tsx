'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import GameCanvas from '@/components/game/GameCanvas';
import { Button } from '@/components/ui/button';

function GameContent() {
  const searchParams = useSearchParams();
  const playerName = searchParams.get('name') || 'Anonymous';
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [winnerName, setWinnerName] = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [finalLength, setFinalLength] = useState(0);
  const [eliminations, setEliminations] = useState(0);

  const handleGameOver = (score: number, length: number) => {
    setFinalScore(score);
    setFinalLength(length);
    setGameOver(true);
    setVictory(false);
  };

  const handleVictory = (winner: string, score: number, length: number, kills: number) => {
    setWinnerName(winner);
    setFinalScore(score);
    setFinalLength(length);
    setEliminations(kills);
    setVictory(true);
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
      <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
        {/* Animated background effect */}
        {victory && (
          <>
            <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent animate-pulse-glow" />
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    backgroundColor: ['#00d9ff', '#ff00aa', '#d4ff00', '#00ff88'][i % 4],
                    animation: `confetti-fall ${3 + Math.random() * 2}s linear ${Math.random() * 2}s infinite`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div className="max-w-md w-full relative z-10">
          <div className="bg-gradient-to-br from-card to-background border-2 border-primary rounded-2xl p-8 text-center shadow-2xl animate-bounce-in">
            {victory ? (
              <>
                <div className="mb-4">
                  <div className="text-8xl mb-4 animate-float">👑</div>
                  <h1 className="text-6xl font-black text-accent mb-3 animate-victory-pulse uppercase">
                    VICTORY!
                  </h1>
                  <p className="text-2xl text-foreground font-bold mb-2 uppercase tracking-wider">
                    🏆 Last Snake Standing 🏆
                  </p>
                  <p className="text-muted-foreground mb-6 text-lg">
                    <span className="text-primary font-bold text-3xl neon-text">{winnerName}</span>
                    <br />
                    <span className="text-xl">has conquered the arena!</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-background/50 rounded-xl p-4 border-2 border-primary hover:border-accent transition-colors">
                    <div className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Score</div>
                    <div className="text-3xl font-black text-primary neon-text">{finalScore}</div>
                  </div>
                  <div className="bg-background/50 rounded-xl p-4 border-2 border-secondary hover:border-accent transition-colors">
                    <div className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Length</div>
                    <div className="text-3xl font-black text-secondary neon-text">{finalLength}</div>
                  </div>
                  <div className="bg-background/50 rounded-xl p-4 border-2 border-accent hover:border-primary transition-colors">
                    <div className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Kills</div>
                    <div className="text-3xl font-black text-accent neon-text">{eliminations}</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-black text-foreground mb-2 neon-text">
                  ELIMINATED
                </h1>
                <p className="text-muted-foreground mb-8">
                  Better luck next time, <span className="text-primary font-bold">{playerName}</span>!
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
              </>
            )}

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

  return <GameCanvas playerName={playerName} onGameOver={handleGameOver} onVictory={handleVictory} />;
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
