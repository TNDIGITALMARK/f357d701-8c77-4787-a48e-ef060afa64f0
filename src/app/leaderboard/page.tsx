'use client';

import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Zap } from 'lucide-react';

// Mock leaderboard data (in a real app, this would come from a backend)
const mockLeaderboard = [
  { rank: 1, name: 'ProSlitherer', score: 2847, length: 342, eliminations: 23 },
  { rank: 2, name: 'NeonViper', score: 2156, length: 289, eliminations: 18 },
  { rank: 3, name: 'PixelPython', score: 1923, length: 267, eliminations: 15 },
  { rank: 4, name: 'CosmicCrusher', score: 1654, length: 234, eliminations: 14 },
  { rank: 5, name: 'SnakeKing42', score: 1456, length: 212, eliminations: 12 },
  { rank: 6, name: 'ElectricEel', score: 1289, length: 198, eliminations: 11 },
  { rank: 7, name: 'GalacticGlider', score: 1123, length: 176, eliminations: 9 },
  { rank: 8, name: 'TurboSerpent', score: 987, length: 165, eliminations: 8 },
  { rank: 9, name: 'OrbitMaster', score: 876, length: 154, eliminations: 7 },
  { rank: 10, name: 'StarStrike', score: 754, length: 142, eliminations: 6 },
];

const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-accent';
  if (rank === 2) return 'text-primary';
  if (rank === 3) return 'text-secondary';
  return 'text-foreground';
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-accent" />;
  if (rank === 2) return <TrendingUp className="w-6 h-6 text-primary" />;
  if (rank === 3) return <Zap className="w-6 h-6 text-secondary" />;
  return <span className="text-xl font-bold text-muted-foreground">{rank}</span>;
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary animate-pulse-glow" />
              <h1 className="text-xl font-bold text-foreground">ORBITAL SNAKES</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-card"
                onClick={() => window.location.href = '/'}
              >
                HOME
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={() => window.location.href = '/'}
              >
                PLAY NOW
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-accent" />
            <h1 className="text-5xl md:text-6xl font-black text-foreground neon-text">
              LEADERBOARD
            </h1>
            <Trophy className="w-12 h-12 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Top players dominating the cosmic arena
          </p>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">847</div>
              <div className="text-sm text-muted-foreground">Players Online</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-3xl font-bold text-secondary mb-2">12,456</div>
              <div className="text-sm text-muted-foreground">Games Today</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-3xl font-bold text-accent mb-2">2,847</div>
              <div className="text-sm text-muted-foreground">Top Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="bg-primary/10 border-b border-border px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-bold text-foreground">
                <div className="col-span-1 text-center">RANK</div>
                <div className="col-span-4">PLAYER</div>
                <div className="col-span-2 text-right">SCORE</div>
                <div className="col-span-2 text-right">LENGTH</div>
                <div className="col-span-3 text-right">ELIMINATIONS</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {mockLeaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`px-6 py-5 hover:bg-card/50 transition group ${
                    entry.rank <= 3 ? 'bg-card/30' : ''
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-1 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Player Name */}
                    <div className="col-span-4">
                      <div className={`text-lg font-bold ${getRankColor(entry.rank)} group-hover:text-primary transition`}>
                        {entry.name}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="col-span-2 text-right">
                      <div className="text-xl font-bold text-foreground">{entry.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>

                    {/* Length */}
                    <div className="col-span-2 text-right">
                      <div className="text-lg font-semibold text-primary">{entry.length}</div>
                      <div className="text-xs text-muted-foreground">segments</div>
                    </div>

                    {/* Eliminations */}
                    <div className="col-span-3 text-right">
                      <div className="text-lg font-semibold text-secondary">{entry.eliminations}</div>
                      <div className="text-xs text-muted-foreground">eliminations</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Think you can make it to the top?
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-12 h-14 neon-glow"
              onClick={() => window.location.href = '/'}
            >
              CHALLENGE THE LEADERBOARD
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card border-t border-border">
        <div className="container mx-auto text-center">
          <div className="text-sm text-muted-foreground">
            © 2025 Orbital Snakes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
