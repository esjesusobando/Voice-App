
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createGeminiAudioBlob } from '../utils/audioUtils';
import Logo from './Logo';

interface RecorderProps {
  onSave: (text: string) => void;
  onCancel: () => void;
}

const Recorder: React.FC<RecorderProps> = ({ onSave, onCancel }) => {
  const [status, setStatus] = useState<'initializing' | 'recording' | 'stopped'>('initializing');
  const [transcription, setTranscription] = useState('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptionRef = useRef('');

  useEffect(() => {
    startRecording();
    return () => { cleanupResources(); };
  }, []);

  const cleanupResources = async () => {
    if (sessionPromiseRef.current) {
      const session = await sessionPromiseRef.current;
      session.close();
    }
    if (audioContextRef.current) audioContextRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
  };

  const startRecording = async () => {
    try {
      setStatus('initializing');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('recording');
            const source = audioCtx.createMediaStreamSource(stream);
            const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (status === 'stopped') return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createGeminiAudioBlob(inputData);
              sessionPromise.then(session => {
                try { session.sendRealtimeInput({ media: pcmBlob }); } catch(err) {}
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioCtx.destination);
          },
          onmessage: (msg: LiveServerMessage) => {
            const part = msg.serverContent?.inputTranscription?.text;
            if (part) {
              transcriptionRef.current += part;
              setTranscription(transcriptionRef.current);
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) { 
      console.error(err);
      onCancel(); 
    }
  };

  const handleStop = async () => {
    await cleanupResources();
    setStatus('stopped');
  };

  return (
    <div className="flex-1 flex flex-col items-center pt-4 px-8 overflow-hidden">
      <div className="w-full flex justify-between items-center opacity-25 scale-75 origin-left mb-2">
        <Logo scale={0.5} />
      </div>

      {/* Speaker Mesh */}
      <div className="speaker-concentric scale-90 -mt-2">
        {Array.from({ length: 225 }).map((_, i) => {
          const x = (i % 15) - 7;
          const y = Math.floor(i / 15) - 7;
          const dist = Math.sqrt(x*x + y*y);
          if (dist > 7.5) return <div key={i} />;
          return (
            <div 
              key={i} 
              className={`hole ${status === 'recording' ? 'animate-pulse' : ''}`}
              style={{
                top: `${50 + (y / 7.5) * 45}%`,
                left: `${50 + (x / 7.5) * 45}%`,
                opacity: 0.85 - (dist / 10),
                transform: `scale(${1 - (dist / 22)})`
              }}
            />
          );
        })}
      </div>

      {/* Record Control */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <button 
          onClick={status === 'recording' ? handleStop : undefined}
          className={`record-button-tactile ${status === 'recording' ? 'animate-pulse' : ''}`}
        />
        <div className="flex flex-col items-center">
            <span className="text-[12px] font-black text-black/30 uppercase tracking-[0.6em]">{status === 'recording' ? 'REC' : 'STOP'}</span>
            {status === 'recording' && <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest mt-1 animate-pulse">Live Signal</span>}
        </div>
      </div>

      {/* Dynamic Transcription Box */}
      <div className="w-full flex-1 overflow-hidden mt-6 px-2 text-center">
        <div className="h-full overflow-y-auto no-scrollbar">
            <p className="font-['Courier_Prime'] text-sm text-black/50 italic leading-relaxed">
              {transcription || (status === 'recording' ? 'Capturing audio spectrum...' : 'Tape primed for recording')}
            </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pb-10 w-full flex flex-col gap-3 mt-4">
        {status === 'stopped' && (
          <button 
            onClick={() => onSave(transcription)}
            className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.5em] text-[10px] rounded-xl active:scale-95 transition-all"
          >
            Archive Tape
          </button>
        )}
        <button 
          onClick={onCancel}
          className="text-[9px] font-bold text-black/30 uppercase tracking-[0.4em] py-2"
        >
          {status === 'stopped' ? 'Discard' : 'Eject'}
        </button>
      </div>
    </div>
  );
};

export default Recorder;
