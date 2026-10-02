'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import ConveyorScene from '@/game/ConveyorScene';

interface Props {
  onSceneReady: (scene: ConveyorScene) => void;
}

export default function ConveyorCanvas({ onSceneReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 320,
      height: 320,
      backgroundColor: '#0f172a',
      scene: [ConveyorScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('ready', () => {
      const scene = game.scene.getScene('ConveyorScene') as ConveyorScene;
      if (scene) {
        onSceneReady(scene);
      }
    });

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [onSceneReady]);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl"
    ></div>
  );
}