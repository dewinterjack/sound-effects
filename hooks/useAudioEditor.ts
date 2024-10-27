import { useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export const useAudioEditor = () => {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    wavesurfer?.on('play', () => {
      setIsPlaying(true);
    });
    wavesurfer?.on('pause', () => {
      setIsPlaying(false);
    });
    wavesurfer?.on('ready', () => {
      setDuration(wavesurfer.getDuration());
    });
    wavesurfer?.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });
    wavesurfer?.on('seeking', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });
  }, [wavesurfer]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioFile(url);
      setIsPlaying(false);
      if (wavesurfer) {
        wavesurfer.load(url);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (wavesurfer) {
      wavesurfer.setVolume(newVolume);
    }
  };

  const handlePlaybackRateChange = (newRate: number) => {
    setPlaybackRate(newRate);
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(newRate);
    }
  };

  const handleReset = () => {
    if (wavesurfer) {
      wavesurfer.seekTo(0);
      wavesurfer.setVolume(1);
      wavesurfer.setPlaybackRate(1);
      setVolume(1);
      setPlaybackRate(1);
      if (isPlaying) {
        wavesurfer.pause();
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const downloadAudio = () => {
    if (audioFile) {
      const link = document.createElement('a');
      link.href = audioFile;
      link.download = 'edited-audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    audioFile,
    isPlaying,
    volume,
    playbackRate,
    wavesurfer,
    setWavesurfer,
    handleFileUpload,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleReset,
    formatTime,
    downloadAudio,
    currentTime,
    duration,
  };
};
