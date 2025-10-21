'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine, Player, GameState } from '@/lib/game-engine';

interface GameCanvasProps {
  playerName: string;
  playerColor: string;
  onGameOver: (score: number, length: number) => void;
  onVictory: (winnerName: string, score: number, length: number, eliminations: number) => void;
}

export default function GameCanvas({ playerName, playerColor, onGameOver, onVictory }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const playerIdRef = useRef<string>(`player-${Date.now()}`);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isBoostingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const [score, setScore] = useState(0);
  const [length, setLength] = useState(10);
  const [survivorCount, setSurvivorCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; score: number; length: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize game engine
    const gameEngine = new GameEngine(canvas.width, canvas.height);
    gameEngineRef.current = gameEngine;

    // Create player with custom color
    const player = gameEngine.createPlayer(playerIdRef.current, playerName, playerColor);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      gameEngine.updatePlayerDirection(
        playerIdRef.current,
        mousePositionRef.current.x,
        mousePositionRef.current.y
      );
    };

    // Mouse down/up for boost
    const handleMouseDown = () => {
      isBoostingRef.current = true;
      gameEngine.updatePlayerSpeed(playerIdRef.current, true);
    };

    const handleMouseUp = () => {
      isBoostingRef.current = false;
      gameEngine.updatePlayerSpeed(playerIdRef.current, false);
    };

    // Touch handlers for mobile
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      gameEngine.updatePlayerDirection(
        playerIdRef.current,
        mousePositionRef.current.x,
        mousePositionRef.current.y
      );
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchstart', handleMouseDown);
    canvas.addEventListener('touchend', handleMouseUp);

    // Game loop
    let lastTime = Date.now();
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      // Update game state
      gameEngine.update(deltaTime);

      // Render
      render(ctx, canvas, gameEngine.getGameState());

      // Check for victory condition
      const gameState = gameEngine.getGameState();
      if (gameState.gameOver && gameState.winner) {
        // Game has a winner
        onVictory(
          gameState.winner.name,
          gameState.winner.score,
          gameState.winner.length,
          gameState.winner.eliminationCount
        );
        return;
      }

      // Update UI
      const currentPlayer = gameState.players.get(playerIdRef.current);
      if (currentPlayer) {
        setScore(currentPlayer.score);
        setLength(currentPlayer.length);

        if (!currentPlayer.isAlive) {
          // Player died but game continues
          onGameOver(currentPlayer.score, currentPlayer.length);
          return;
        }
      }

      // Update survivor count
      const aliveCount = Array.from(gameState.players.values()).filter(p => p.isAlive).length;
      setSurvivorCount(aliveCount);

      // Update leaderboard every second
      if (now % 1000 < 16) {
        setLeaderboard(gameEngine.getLeaderboard());
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchend', handleMouseUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      gameEngine.cleanup();
    };
  }, [playerName, playerColor, onGameOver, onVictory]);

  const render = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, gameState: GameState) => {
    // Clear canvas
    ctx.fillStyle = '#0f1229';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 40 + Date.now() * 0.01) % canvas.width;
      const y = (i * 50) % canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw food
    gameState.food.forEach(food => {
      ctx.fillStyle = food.color;
      ctx.shadowColor = food.color;
      ctx.shadowBlur = food.isSpecial ? 15 : 8;
      ctx.beginPath();
      ctx.arc(food.position.x, food.position.y, food.isSpecial ? 8 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw particles
    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw players
    gameState.players.forEach(player => {
      if (!player.isAlive) return;

      // Draw snake body
      ctx.strokeStyle = player.color;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 15;

      ctx.beginPath();
      player.segments.forEach((segment, index) => {
        if (index === 0) {
          ctx.moveTo(segment.x, segment.y);
        } else {
          ctx.lineTo(segment.x, segment.y);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw head
      const head = player.segments[0];
      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw eyes
      const eyeOffset = 4;
      const eyeAngle = player.angle;
      const eye1X = head.x + Math.cos(eyeAngle + 0.3) * eyeOffset;
      const eye1Y = head.y + Math.sin(eyeAngle + 0.3) * eyeOffset;
      const eye2X = head.x + Math.cos(eyeAngle - 0.3) * eyeOffset;
      const eye2Y = head.y + Math.sin(eyeAngle - 0.3) * eyeOffset;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eye1X, eye1Y, 2, 0, Math.PI * 2);
      ctx.arc(eye2X, eye2Y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw player name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(player.name, head.x, head.y - 20);
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
      />

      {/* Game UI Overlay */}
      <div className="absolute top-6 left-6 bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
          <div
            className="w-6 h-6 rounded-full border-2 border-foreground"
            style={{
              backgroundColor: playerColor,
              boxShadow: `0 0 10px ${playerColor}80`
            }}
          />
          <div className="text-sm font-semibold text-foreground truncate max-w-[120px]">
            {playerName}
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-1">Score</div>
        <div className="text-3xl font-bold text-primary neon-text">{score}</div>
        <div className="text-sm text-muted-foreground mt-2">Length</div>
        <div className="text-xl font-semibold text-foreground">{length}</div>
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground mb-1">Survivors</div>
          <div className={`text-2xl font-bold ${survivorCount <= 3 ? 'text-accent animate-pulse-glow' : 'text-secondary'}`}>
            {survivorCount}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="absolute top-6 right-6 bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border min-w-[200px]">
        <h3 className="text-lg font-bold text-foreground mb-3">Top Players</h3>
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className={`font-semibold ${index === 0 ? 'text-accent' : index === 1 ? 'text-primary' : index === 2 ? 'text-secondary' : 'text-foreground'}`}>
                {index + 1}. {entry.name}
              </span>
              <span className="text-muted-foreground">{entry.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-border">
        <p className="text-sm text-foreground">
          <span className="font-semibold text-primary">Move:</span> Mouse/Touch •
          <span className="font-semibold text-primary ml-2">Boost:</span> Hold Click/Touch
        </p>
      </div>
    </div>
  );
}
