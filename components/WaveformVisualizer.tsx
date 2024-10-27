import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  audioUrl: string;
  audioContext: AudioContext;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ audioUrl, audioContext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const analyzeAndDrawWaveform = async () => {
      const waveformData = await analyzeAudio(audioUrl);
      drawWaveform(waveformData);
    };

    analyzeAndDrawWaveform();
  }, [audioUrl, audioContext]);

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

  const drawWaveform = (waveformData: number[]) => {
    if (canvasRef.current && waveformData.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        waveformData.forEach((point, index) => {
          const x = (index / waveformData.length) * canvas.width;
          const y = (1 - point) * canvas.height;
          ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#3B82F6';
        ctx.stroke();
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={100}
      className="w-full h-24 mb-4"
    />
  );
};

export default WaveformVisualizer;
