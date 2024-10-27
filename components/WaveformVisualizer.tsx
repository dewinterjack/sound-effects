"use client"

import React, { useEffect, useRef, useState } from 'react';

interface WaveformVisualizerProps {
  audioUrl: string;
  audioContext: AudioContext;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ audioUrl, audioContext, currentTime, duration, onSeek }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    const analyzeAndDrawWaveform = async () => {
      const data = await analyzeAudio(audioUrl);
      setWaveformData(data);
    };

    analyzeAndDrawWaveform();
  }, [audioUrl, audioContext]);

  useEffect(() => {
    drawWaveform();
  }, [currentTime, waveformData]);

  const analyzeAudio = async (audioUrl: string): Promise<number[]> => {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const samples = 1000;
    const blockSize = Math.floor(channelData.length / samples);
    const waveform = [];

    for (let i = 0; i < samples; i++) {
      const start = i * blockSize;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[start + j]);
      }
      waveform.push(sum / blockSize);
    }

    return waveform;
  };

  const drawWaveform = () => {
    if (canvasRef.current && waveformData.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw waveform
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        waveformData.forEach((point, index) => {
          const x = (index / waveformData.length) * canvas.width;
          const y = (1 - point) * canvas.height;
          ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#3B82F6';
        ctx.stroke();
        
        // Draw progress indicator
        if (duration > 0) {
          const progress = currentTime / duration;
          const x = progress * canvas.width;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const clickedTime = (x / rect.width) * duration;
      onSeek(clickedTime);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={100}
      className="w-full h-24 mb-4 cursor-pointer"
      onClick={handleClick}
    />
  );
};

export default WaveformVisualizer;