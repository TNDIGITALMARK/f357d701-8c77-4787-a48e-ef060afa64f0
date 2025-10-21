'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Crown, Gamepad2 } from 'lucide-react';

const PLAYER_COLORS = [
  { name: 'Cyan', value: '#00d9ff' },
  { name: 'Magenta', value: '#ff00aa' },
  { name: 'Yellow', value: '#d4ff00' },
  { name: 'Green', value: '#00ff88' },
  { name: 'Orange', value: '#ff6b00' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Hot Pink', value: '#ff0066' },
  { name: 'Aqua', value: '#00ffff' },
  { name: 'Amber', value: '#ff9900' },
  { name: 'Lime', value: '#66ff00' },
  { name: 'Violet', value: '#9933ff' },
  { name: 'Rose', value: '#ff3366' },
];

export default function HomePage() {
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0].value);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = () => {
    if (playerName.trim()) {
      setIsStarting(true);
      window.location.href = `/game?name=${encodeURIComponent(playerName.trim())}&color=${encodeURIComponent(selectedColor)}`;
    }
  };

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
            <div className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-sm font-semibold text-foreground hover:text-primary transition">
                HOME
              </a>
              <a href="/leaderboard" className="text-sm font-semibold text-foreground hover:text-primary transition">
                LEADERBOARD
              </a>
              <a href="#about" className="text-sm font-semibold text-foreground hover:text-primary transition">
                ABOUT
              </a>
              <a href="#contact" className="text-sm font-semibold text-foreground hover:text-primary transition">
                CONTACT
              </a>
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => document.getElementById('play-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              PLAY NOW
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground neon-text">
                DEVOUR.<br />
                GROW.<br />
                DOMINATE THE<br />
                COSMOS.
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Join thousands of players in the ultimate multiplayer snake arena.
                Consume glowing orbs, eliminate rivals, and climb to the top of the cosmic food chain.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8"
                  onClick={() => document.getElementById('play-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  START PLAYING
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold text-lg px-8 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => window.location.href = '/leaderboard'}
                >
                  VIEW RANKS
                </Button>
              </div>
            </div>

            {/* Right: Game Preview */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-card to-background rounded-2xl border-2 border-primary/30 overflow-hidden relative">
                {/* Mock game canvas preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" className="opacity-70">
                    {/* Animated snakes */}
                    <defs>
                      <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#00d9ff', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#00d9ff', stopOpacity: 0.5 }} />
                      </linearGradient>
                      <linearGradient id="magenta-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#ff00aa', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#ff00aa', stopOpacity: 0.5 }} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Cyan snake */}
                    <path
                      d="M 50,150 Q 150,100 250,150 T 450,150"
                      fill="none"
                      stroke="url(#cyan-grad)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      className="animate-pulse-glow"
                    />
                    <circle cx="450" cy="150" r="10" fill="#00d9ff" filter="url(#glow)" />

                    {/* Magenta snake */}
                    <path
                      d="M 500,250 Q 400,200 300,250 T 100,250"
                      fill="none"
                      stroke="url(#magenta-grad)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      className="animate-pulse-glow"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <circle cx="100" cy="250" r="10" fill="#ff00aa" filter="url(#glow)" />

                    {/* Food pellets */}
                    {[...Array(20)].map((_, i) => (
                      <circle
                        key={i}
                        cx={50 + (i * 25) % 500}
                        cy={80 + (i * 37) % 300}
                        r="4"
                        fill={['#00d9ff', '#ff00aa', '#d4ff00', '#00ff88'][i % 4]}
                        filter="url(#glow)"
                        className="animate-pulse-glow"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </svg>
                </div>

                {/* URL bar overlay */}
                <div className="absolute top-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-xs">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />
                  </div>
                  <div className="flex-1 bg-input rounded px-3 py-1 text-muted-foreground">
                    play.orbitalsnakes.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-card/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                UNLEASH YOUR COSMIC POWER
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                ASCEND THE RANKS
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Accumulate mass and dominate the arena. Become the longest snake and establish supremacy.
                Watch your name climb the global leaderboard as you eliminate competition and consume cosmic energy.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">
              FEATURE HIGHLIGHTS
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-background border-2 border-border rounded-xl p-8 text-center hover:border-primary transition group">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">DYNAMIC GAMEPLAY</h4>
                <p className="text-sm text-muted-foreground">
                  Fast-paced action with smooth controls and responsive mechanics
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background border-2 border-border rounded-xl p-8 text-center hover:border-secondary transition group">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <Crown className="w-8 h-8 text-secondary" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">GLOBAL COMPETITION</h4>
                <p className="text-sm text-muted-foreground">
                  Compete against players worldwide and dominate the leaderboard
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background border-2 border-border rounded-xl p-8 text-center hover:border-accent transition group">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <Gamepad2 className="w-8 h-8 text-accent" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">CROSS-PLATFORM PLAY</h4>
                <p className="text-sm text-muted-foreground">
                  Play seamlessly on desktop, mobile, or tablet devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Play Section */}
      <section id="play-section" className="py-20 px-6">
        <div className="container mx-auto max-w-xl">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border-2 border-primary p-8">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
              JOIN THE ARENA – PLAY FREE!
            </h2>
            <p className="text-muted-foreground mb-6 text-center">
              Choose your snake name and color to dominate the cosmic battlefield
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  SNAKE NAME
                </label>
                <Input
                  type="text"
                  placeholder="Enter your snake name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartGame()}
                  className="text-center text-lg h-12 bg-background border-2 border-border focus:border-primary"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  SNAKE COLOR
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {PLAYER_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`relative aspect-square rounded-lg transition-all duration-200 ${
                        selectedColor === color.value
                          ? 'ring-4 ring-foreground scale-110 shadow-lg'
                          : 'ring-2 ring-border hover:ring-foreground/50 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: color.value,
                        boxShadow: selectedColor === color.value ? `0 0 20px ${color.value}80` : 'none',
                      }}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    >
                      {selectedColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Selected: <span className="font-semibold" style={{ color: selectedColor }}>
                    {PLAYER_COLORS.find(c => c.value === selectedColor)?.name}
                  </span>
                </p>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl h-14 neon-glow"
                onClick={handleStartGame}
                disabled={!playerName.trim() || isStarting}
              >
                {isStarting ? 'STARTING...' : 'START GAME'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-6 bg-card border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">CONTACT US</h3>
              <p className="text-sm text-muted-foreground">play@orbitalsnakes.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">FOLLOW US</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  Instagram
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  TikTok
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">GAME STATUS</h3>
              <p className="text-sm text-muted-foreground">
                <span className="text-neon-green">●</span> Online - 847 Players
              </p>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            © 2025 Orbital Snakes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
