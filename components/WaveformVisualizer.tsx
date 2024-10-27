"use client"

import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'

interface WaveformVisualizerProps {
  audioUrl: string;
  wavesurfer: WaveSurfer | null;
  setWavesurfer: (ws: WaveSurfer | null) => void;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioUrl,
  wavesurfer,
  setWavesurfer,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waveformRef.current && !wavesurfer) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4A90E2',
        progressColor: '#2C5282',
        cursorColor: '#2C5282',
        barWidth: 2,
        barRadius: 3,
        height: 100,
        normalize: true,
        plugins: [TimelinePlugin.create()],
      });

      ws.on('finish', () => {
        ws.pause();
        ws.seekTo(0);
      });

      setWavesurfer(ws);

      return () => {
        if (ws) {
          ws.destroy();
        }
        setWavesurfer(null);
      };
    }
  }, [setWavesurfer]);

  useEffect(() => {
    if (wavesurfer && audioUrl) {
      wavesurfer.load(audioUrl);
    }
  }, [wavesurfer, audioUrl]);

  return <div ref={waveformRef} />;
};

export default WaveformVisualizer;
