"use client"

import { RotateCcw, Download, Pause, Play } from 'lucide-react';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import { useAudioEditor } from '@/hooks/useAudioEditor';

const AudioEditor = () => {
  const {
    audioFile,
    volume,
    playbackRate,
    wavesurfer,
    isPlaying,
    duration,
    currentTime,
    setWavesurfer,
    handleFileUpload,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleReset,
    formatTime,
    downloadAudio,
  } = useAudioEditor();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Audio File
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {audioFile && (
          <>
            <WaveformVisualizer 
              audioUrl={audioFile}
              wavesurfer={wavesurfer}
              setWavesurfer={setWavesurfer}
            />

            <div className="flex items-center justify-between">
              <button onClick={() => wavesurfer?.playPause()} className="p-2 rounded-full hover:bg-gray-100">
                {isPlaying ? <Pause className="w-6 h-6 text-gray-600" /> : <Play className="w-6 h-6 text-gray-600" />}
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <RotateCcw className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-sm text-gray-500 w-[200px] text-right">
                {wavesurfer && formatTime(currentTime)} / {wavesurfer && formatTime(duration)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Playback Speed: {playbackRate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              onClick={downloadAudio}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Edited Audio</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioEditor;
