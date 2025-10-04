import React, { useState, useRef } from 'react';
import { SpeakerWaveIcon, SpinnerIcon, PlayIcon, PauseIcon } from './IconComponents';
// This import is for simulation purposes. In a real app, this logic would be on a server.
import { generateAudioFromText } from '../../server/functions';

const voices = [
    { name: 'Vietnamese (Female)', value: 'vi-VN-Standard-A', lang: 'vi-VN' },
    { name: 'Vietnamese (Male)', value: 'vi-VN-Standard-B', lang: 'vi-VN' },
    { name: 'US English (Female)', value: 'en-US-Standard-C', lang: 'en-US' },
    { name: 'US English (Male)', value: 'en-US-Standard-D', lang: 'en-US' },
    { name: 'British English (Female)', value: 'en-GB-Standard-A', lang: 'en-GB' },
];

// Helper to convert base64 to a Blob URL
const base64ToBlobUrl = (base64: string, mimeType: string): string => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
};

const TextToSpeech: React.FC = () => {
    const [text, setText] = useState('Chào mừng đến với YT Pro Tools, công cụ tối ưu hóa kênh YouTube hàng đầu dành cho các nhà sáng tạo nội dung.');
    const [selectedVoice, setSelectedVoice] = useState(voices[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleGenerateAudio = async () => {
        if (!text.trim()) {
            setError('Vui lòng nhập văn bản để tạo âm thanh.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAudioUrl(null);
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }

        try {
            // ================== FRONTEND CALLING THE BACKEND ==================
            // In a real app, this would be a fetch call to your deployed Cloud Function URL.
            // const response = await fetch('https://your-backend-url.com/api/text-to-speech', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         text,
            //         voice: selectedVoice,
            //         languageCode: voices.find(v => v.value === selectedVoice)?.lang,
            //     }),
            // });
            // if (!response.ok) {
            //     throw new Error('Yêu cầu đến backend thất bại.');
            // }
            // const data = await response.json();
            // const base64Audio = data.audioContent;
            // =================================================================

            // We simulate the call to the backend function for now.
            const selectedVoiceData = voices.find(v => v.value === selectedVoice);
            if (!selectedVoiceData) {
                throw new Error("Invalid voice selected.");
            }
            const base64Audio = await generateAudioFromText(text, selectedVoiceData.value, selectedVoiceData.lang);
            
            // Convert the base64 audio to a playable URL and set it
            const url = base64ToBlobUrl(base64Audio, 'audio/mpeg');
            setAudioUrl(url);

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định.';
            setError(`Không thể tạo âm thanh: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };
    
     const handleAudioStateChange = () => {
        if (audioRef.current) {
            setIsPlaying(!audioRef.current.paused);
        }
    };

    return (
        <section id="text-to-speech" className="py-20 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main">Chuyển Văn Bản Thành Giọng Nói</h2>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Tạo giọng đọc AI chất lượng cao cho video của bạn. Dán kịch bản, chọn giọng đọc, và tạo file âm thanh chỉ trong vài giây.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-card border border-secondary rounded-xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="voice-select" className="block text-text-secondary mb-2 font-semibold">Chọn Giọng Đọc</label>
                            <select
                                id="voice-select"
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                disabled={isLoading}
                            >
                                {voices.map(voice => (
                                    <option key={voice.value} value={voice.value}>{voice.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                             <button
                                onClick={handleGenerateAudio}
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2"
                            >
                                {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <SpeakerWaveIcon className="w-6 h-6" />}
                                <span>{isLoading ? 'Đang tạo...' : 'Tạo Âm Thanh'}</span>
                            </button>
                        </div>
                    </div>
                    
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Dán kịch bản của bạn vào đây..."
                        className="w-full h-48 bg-background border border-secondary rounded-lg p-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        disabled={isLoading}
                    />
                    
                    {error && <p className="text-red-400 mt-4 text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}
                    
                    {audioUrl && (
                        <div className="mt-8 pt-6 border-t border-secondary animate-fade-in">
                             <h3 className="text-xl font-bold text-text-main mb-4">Nghe lại Âm thanh:</h3>
                             <div className="bg-background p-4 rounded-lg border border-secondary flex items-center gap-4">
                                <button onClick={togglePlayPause} className="p-3 bg-primary rounded-full text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary">
                                    {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                                </button>
                                <div className="w-full">
                                  <audio 
                                      ref={audioRef} 
                                      src={audioUrl}
                                      controls
                                      onPlay={handleAudioStateChange}
                                      onPause={handleAudioStateChange}
                                      onEnded={handleAudioStateChange}
                                      className="w-full"
                                  />
                                </div>
                             </div>
                        </div>
                    )}

                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                  0% { opacity: 0; transform: translateY(10px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </section>
    );
};

export default TextToSpeech;
