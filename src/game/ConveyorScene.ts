import Phaser from 'phaser';

export interface PackageItem {
  id: number;
  color: 'BLUE' | 'RED';
  colorHex: number;
}

export default class ConveyorScene extends Phaser.Scene {
  private gateDirection: 'STRAIGHT' | 'DIVERT' = 'STRAIGHT';
  private gateVisual!: Phaser.GameObjects.Rectangle;
  private currentBox: Phaser.GameObjects.Rectangle | null = null;
  private currentBoxLabel: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('ConveyorScene');
  }

  create() {
    // 1. Gambar Jalur Konveyor Utama (Abu-abu Gelap)
    this.add.rectangle(150, 150, 260, 40, 0x334155); // Jalur Utama

    // Jalur Percabangan B (Membelok ke Bawah)
    this.add.rectangle(170, 210, 40, 80, 0x334155);

    // Titik Akhir / Wadah Penampung
    // Jalur A (Lurus - Barang Normal)
    const binA = this.add.rectangle(270, 150, 45, 55, 0x1e293b);
    binA.setStrokeStyle(2, 0x3b82f6);
    this.add.text(255, 142, 'BIN A', { fontSize: '10px', color: '#60a5fa', fontStyle: 'bold' });

    // Jalur B (Bawah - Barang Cacat/Recycle)
    const binB = this.add.rectangle(170, 260, 55, 45, 0x1e293b);
    binB.setStrokeStyle(2, 0xef4444);
    this.add.text(155, 252, 'BIN B', { fontSize: '10px', color: '#f87171', fontStyle: 'bold' });

    // 2. Tuas Pemilah / Diverter Gate di persimpangan (x: 170, y: 150)
    this.gateVisual = this.add.rectangle(170, 150, 8, 38, 0xfacc15); // Warna Kuning

    // Garis Sensor Pemindai
    const sensorLine = this.add.rectangle(110, 150, 2, 40, 0x38bdf8);
    this.add.text(90, 115, 'SENSOR', { fontSize: '9px', color: '#38bdf8' });

    this.updateGateVisual();
  }

  setGateDirection(direction: 'STRAIGHT' | 'DIVERT') {
    this.gateDirection = direction;
    this.updateGateVisual();
  }

  private updateGateVisual() {
    if (!this.gateVisual) return;
    if (this.gateDirection === 'STRAIGHT') {
      this.gateVisual.setAngle(0); // Posisi lurus, menutup jalur bawah
    } else {
      this.gateVisual.setAngle(45); // Terbuka miring, membelokkan paket ke bawah
    }
  }

  // Animasi jalannya satu paket di konveyor
  async processPackage(
    pkg: PackageItem,
    onComplete: (success: boolean, resultText: string) => void
  ) {
    if (this.currentBox) {
      this.currentBox.destroy();
      this.currentBoxLabel?.destroy();
    }

    // Munculkan boks di pangkal konveyor kiri
    this.currentBox = this.add.rectangle(40, 150, 28, 28, pkg.colorHex);
    this.currentBoxLabel = this.add.text(28, 142, pkg.color === 'RED' ? 'CACAT' : 'OK', {
      fontSize: '8px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    // Tahap 1: Berjalan dari pangkal ke sensor & persimpangan
    await new Promise((resolve) => {
      this.tweens.add({
        targets: [this.currentBox, this.currentBoxLabel],
        x: '+=130',
        duration: 900,
        onComplete: () => resolve(true),
      });
    });

    // Tahap 2: Evaluasi arah gerak berdasarkan tuas
    if (this.gateDirection === 'STRAIGHT') {
      // Meluncur lurus ke Bin A
      await new Promise((resolve) => {
        this.tweens.add({
          targets: [this.currentBox, this.currentBoxLabel],
          x: '+=100',
          duration: 700,
          onComplete: () => resolve(true),
        });
      });

      // Cek kebenaran: Bin A harusnya untuk barang biru
      if (pkg.color === 'BLUE') {
        onComplete(true, 'Paket Normal berhasil masuk ke Bin A (Lurus).');
      } else {
        onComplete(false, 'GAGAL: Paket Cacat (Merah) lolos masuk ke wadah normal Bin A!');
      }
    } else {
      // Membelok ke Bin B (Bawah)
      await new Promise((resolve) => {
        this.tweens.add({
          targets: [this.currentBox, this.currentBoxLabel],
          y: '+=110',
          duration: 700,
          onComplete: () => resolve(true),
        });
      });

      // Cek kebenaran: Bin B harusnya untuk barang merah
      if (pkg.color === 'RED') {
        onComplete(true, 'Paket Cacat (Merah) berhasil disortir ke Bin B (Daur Ulang).');
      } else {
        onComplete(false, 'SALAH SORTIR: Paket Normal (Biru) terbuang ke Bin B!');
      }
    }
  }

  resetScene() {
    if (this.currentBox) {
      this.currentBox.destroy();
      this.currentBox = null;
    }
    if (this.currentBoxLabel) {
      this.currentBoxLabel.destroy();
      this.currentBoxLabel = null;
    }
    this.setGateDirection('STRAIGHT');
  }
}