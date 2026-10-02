'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import ConveyorScene, { PackageItem } from '@/game/ConveyorScene';

const ConveyorCanvas = dynamic(() => import('@/components/ConveyorCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-[320px] h-[320px] bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400">
      Menghubungkan Mesin Konveyor...
    </div>
  ),
});

export default function Home() {
  const [scene, setScene] = useState<ConveyorScene | null>(null);
  const [conditionTarget, setConditionTarget] = useState<'RED' | 'BLUE'>('RED');
  const [chosenAction, setChosenAction] = useState<'DIVERT' | 'STRAIGHT'>('STRAIGHT');
  const [elseAction, setElseAction] = useState<'DIVERT' | 'STRAIGHT'>('STRAIGHT');
  const [statusMsg, setStatusMsg] = useState<string>(
    'Rancang aturan percabangan sensor agar paket tersortir ke wadah yang benar!'
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Variabel Telemetri Analitik
  const attempts = useRef(0);
  const startTime = useRef(Date.now());

  // Antrean uji coba: 2 paket (1 Biru normal, 1 Merah cacat)
  const testQueue: PackageItem[] = [
    { id: 1, color: 'RED', colorHex: 0xef4444 },
    { id: 2, color: 'BLUE', colorHex: 0x3b82f6 },
  ];

  const handleRunSimulation = async () => {
    if (!scene || isProcessing) return;

    setIsProcessing(true);
    attempts.current += 1;
    setStatusMsg('Memulai simulasi penyortiran ban berjalan...');

    let allSuccess = true;
    let failureDetail = '';

    for (const item of testQueue) {
      // 1. Evaluasi logika percabangan siswa
      let selectedGate: 'STRAIGHT' | 'DIVERT';
      if (item.color === conditionTarget) {
        selectedGate = chosenAction;
      } else {
        selectedGate = elseAction;
      }

      // 2. Terapkan tuas di Phaser
      scene.setGateDirection(selectedGate);

      // 3. Jalankan paket
      await new Promise<void>((resolve) => {
        scene.processPackage(item, (success, resultText) => {
          if (!success) {
            allSuccess = false;
            failureDetail = resultText;
          }
          resolve();
        });
      });

      if (!allSuccess) break;
      await new Promise((res) => setTimeout(res, 400));
    }

    const durationSec = Math.floor((Date.now() - startTime.current) / 1000);
    setIsProcessing(false);

    // Payload Log Analitik Pembelajaran
    const telemetryData = {
      game_name: 'SmartCodeConveyor',
      level_id: 1,
      attempt_number: attempts.current,
      duration_seconds: durationSec,
      rules_constructed: {
        condition: `IF (Item == ${conditionTarget})`,
        then_branch: chosenAction,
        else_branch: elseAction,
      },
      is_success: allSuccess,
      error_message: allSuccess ? null : failureDetail,
      timestamp: new Date().toISOString(),
    };

    console.log('📦 [TELEMETRI SMART CODE CONVEYOR]:', telemetryData);

    if (allSuccess) {
      setStatusMsg(
        `🎉 Sempurna! Seluruh paket tersortir dengan benar dalam ${durationSec}s (${attempts.current} percobaan).`
      );
    } else {
      setStatusMsg(`❌ ${failureDetail}`);
    }
  };

  const handleReset = () => {
    if (isProcessing) return;
    scene?.resetScene();
    setStatusMsg('Mesin konveyor di-reset. Sesuaikan kembali aturan logika.');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-6 font-sans">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-black text-amber-400">
          SmartCodeConveyor <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">Otomasi Lab</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Materi: Struktur Logika Percabangan Pemilah (IF - ELSE)
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 max-w-4xl w-full justify-center items-start">
        {/* Kanvas Mesin Konveyor */}
        <div className="flex flex-col items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
          <ConveyorCanvas onSceneReady={setScene} />
          <div className="flex gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-500 rounded-sm inline-block"></span> Bin A (Normal)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-500 rounded-sm inline-block"></span> Bin B (Cacat)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-yellow-400 rounded-sm inline-block"></span> Tuas Gerbang
            </span>
          </div>
        </div>

        {/* Panel Logika Pemrograman Konveyor */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl w-full lg:w-96 shadow-md flex flex-col gap-4">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Aturan Sensor Logika (Branching Rule)
            </span>
          </div>

          {/* Blok IF */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-amber-400 font-bold">JIKA</span>
              <span className="text-slate-400">Warna Paket ==</span>
              <select
                disabled={isProcessing}
                value={conditionTarget}
                onChange={(e) => setConditionTarget(e.target.value as 'RED' | 'BLUE')}
                className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 outline-none"
              >
                <option value="RED">MERAH (Cacat)</option>
                <option value="BLUE">BIRU (Normal)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono pl-4">
              <span className="text-emerald-400 font-bold">MAKA</span>
              <span className="text-slate-400">Arah Tuas:</span>
              <select
                disabled={isProcessing}
                value={chosenAction}
                onChange={(e) => setChosenAction(e.target.value as 'DIVERT' | 'STRAIGHT')}
                className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 outline-none"
              >
                <option value="STRAIGHT">Lurus (Bin A)</option>
                <option value="DIVERT">Belokkan (Bin B)</option>
              </select>
            </div>
          </div>

          {/* Blok ELSE */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-mono">
            <span className="text-purple-400 font-bold">SELAIN ITU</span>
            <span className="text-slate-400">Arah Tuas:</span>
            <select
              disabled={isProcessing}
              value={elseAction}
              onChange={(e) => setElseAction(e.target.value as 'DIVERT' | 'STRAIGHT')}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 outline-none"
            >
              <option value="STRAIGHT">Lurus (Bin A)</option>
              <option value="DIVERT">Belokkan (Bin B)</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleRunSimulation}
              disabled={isProcessing}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              {isProcessing ? 'Mesin Bergerak...' : '▶ Jalankan Konveyor'}
            </button>
            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2.5 px-4 rounded-xl text-xs font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Kotak Umpan Balik Log Sistem */}
      <div className="mt-5 max-w-4xl w-full bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-center text-xs text-slate-300 shadow">
        {statusMsg}
      </div>
    </main>
  );
}