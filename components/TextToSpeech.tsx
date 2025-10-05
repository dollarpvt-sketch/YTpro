import React, { useState } from 'react';
import { 
    SpeakerWaveIcon, SpinnerIcon, PlayIcon, DownloadIcon,
    AdjustmentsHorizontalIcon, InformationCircleIcon, AiIcon
} from './IconComponents';
import { generateAudio, getAiVoiceDirectorSuggestions } from '../server/functions';

const premiumVoices = [
    { displayName: 'Tiếng Việt - Nữ Miền Bắc (Cao cấp)', name: 'vi-VN-Wavenet-D', languageCode: 'vi-VN' },
    { displayName: 'Tiếng Việt - Nam Miền Bắc (Cao cấp)', name: 'vi-VN-Wavenet-B', languageCode: 'vi-VN' },
    { displayName: 'Tiếng Việt - Nữ Miền Nam', name: 'vi-VN-Standard-A', languageCode: 'vi-VN' },
    { displayName: 'Tiếng Việt - Nam Miền Nam', name: 'vi-VN-Standard-C', languageCode: 'vi-VN' },
    { displayName: 'English US - Nữ (Tự nhiên)', name: 'en-US-Neural2-C', languageCode: 'en-US' },
    { displayName: 'English US - Nam (Tự nhiên)', name: 'en-US-Neural2-D', languageCode: 'en-US' },
    { displayName: 'English UK - Nữ (Cao cấp)', name: 'en-GB-Wavenet-A', languageCode: 'en-GB' },
    { displayName: 'English UK - Nam (Cao cấp)', name: 'en-GB-Wavenet-B', languageCode: 'en-GB' },
];

const TextToSpeech: React.FC = () => {
    const [script, setScript] = useState('Chào mừng đến với YT Pro Tools. Giờ đây, bạn có thể tạo ra giọng đọc AI chất lượng cao từ Google Cloud và tải về dưới dạng tệp MP3.');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(0);
    const [selectedVoice, setSelectedVoice] = useState(premiumVoices[0].name);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleGenerateAudio = async () => {
        if (!script.trim()) {
            setError('Vui lòng nhập kịch bản.'); return;
        }
       
        setIsLoading(true); setError(null); setAudioUrl(null);

        try {
            // Call the simulated backend function
            const audioSrc = await generateAudio(script, selectedVoice, rate, pitch);
            setAudioUrl(audioSrc);
        } catch (e) {
            const errorMessage = `Lỗi tạo âm thanh: ${e instanceof Error ? e.message : 'Đã có lỗi xảy ra.'}`;
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAiAnalysis = async () => {
        if (!script.trim()) {
            setError('Vui lòng nhập kịch bản để AI phân tích.'); return;
        }
        setIsAnalyzing(true); setAiSuggestions([]); setError(null);
        
        try {
            // Call the simulated backend function
            const suggestions = await getAiVoiceDirectorSuggestions(script);
            setAiSuggestions(suggestions);
        } catch(e) {
             setError(`Lỗi phân tích AI: ${e instanceof Error ? e.message : 'Thử lại sau.'}`);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    return (
        <section id="text-to-speech-studio" className="py-20 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <div className="flex justify-center items-center gap-4 mb-4">
                        <SpeakerWaveIcon className="w-10 h-10 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main">Voiceover Studio</h2>
                    </div>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Tạo giọng đọc chuyên nghiệp với công nghệ Google Cloud và tải về tệp MP3 để sử dụng.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-secondary rounded-xl p-6">
                             <h3 className="text-xl font-bold text-text-main mb-4">Kịch bản</h3>
                             <textarea
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                                placeholder="Dán kịch bản của bạn vào đây..."
                                className="w-full h-64 bg-background border border-secondary rounded-lg p-4 text-text-main text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isLoading}
                            />
                        </div>
                         <div className="bg-card border border-secondary rounded-xl p-6">
                             <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><AiIcon className="w-6 h-6 text-accent"/>Đạo diễn lồng tiếng AI</h3>
                                <button onClick={handleAiAnalysis} disabled={isAnalyzing || isLoading} className="bg-accent/20 text-accent font-semibold py-2 px-4 rounded-lg hover:bg-accent/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isAnalyzing ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : 'Phân tích & Gợi ý'}
                                </button>
                            </div>
                            {isAnalyzing ? (
                                 <div className="flex items-center justify-center text-text-secondary gap-3 py-4">
                                    <SpinnerIcon className="w-6 h-6 animate-spin" />
                                    <span>AI đang đọc kịch bản của bạn...</span>
                                </div>
                            ) : aiSuggestions.length > 0 ? (
                                <ul className="space-y-3 text-text-secondary">
                                    {aiSuggestions.map((s, i) => <li key={i} className="flex items-start gap-3 p-2 bg-background/50 rounded-md"><InformationCircleIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span>{s}</span></li>)}
                                </ul>
                            ) : (
                                <p className="text-sm text-text-secondary text-center py-4">Nhấp vào nút phân tích để nhận các mẹo cải thiện kịch bản của bạn.</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card border border-secondary rounded-xl p-6 self-start">
                            <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><AdjustmentsHorizontalIcon className="w-6 h-6"/>Bảng điều khiển Studio</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="font-semibold text-text-secondary">Giọng đọc (Google Cloud)</label>
                                     <select 
                                        value={selectedVoice} 
                                        onChange={e => setSelectedVoice(e.target.value)} 
                                        className="w-full bg-secondary border border-secondary/50 rounded p-2 text-text-secondary text-sm focus:outline-none focus:ring-1 focus:ring-primary mt-2"
                                        disabled={isLoading}
                                    >
                                        {premiumVoices.map(v => <option key={v.name} value={v.name}>{v.displayName}</option>)}
                                     </select>
                                </div>
                                <div>
                                    <label className="font-semibold text-text-secondary">Tốc độ nói</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min="0.5" max="2" step="0.05" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full" disabled={isLoading}/>
                                        <span className="text-text-main font-mono w-12 text-center">{rate.toFixed(2)}x</span>
                                    </div>
                                </div>
                                 <div>
                                    <label className="font-semibold text-text-secondary">Cao độ</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min="-10" max="10" step="0.5" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full" disabled={isLoading}/>
                                        <span className="text-text-main font-mono w-12 text-center">{pitch.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-secondary rounded-xl p-4 self-start space-y-3">
                            <button onClick={handleGenerateAudio} disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                                {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin"/> : <PlayIcon className="w-6 h-6"/>}
                                {isLoading ? 'Đang tạo...' : 'Tạo Âm Thanh'}
                            </button>
                            {audioUrl && (
                                <div className="space-y-3 animate-fade-in">
                                    <audio src={audioUrl} controls className="w-full h-12" />
                                    <a href={audioUrl} download="yt-pro-tools-voiceover.mp3" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                                        <DownloadIcon className="w-6 h-6"/> Tải xuống MP3
                                    </a>
                                </div>
                            )}
                        </div>
                        {error && <p className="text-red-400 text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}
                    </div>
                </div>

            </div>
             <style>{`
                input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; background: #282828; border-radius: 5px; outline: none; transition: background 0.2s; }
                input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #FF0000; cursor: pointer; border-radius: 50%; border: 3px solid #1E1E1E; }
                input[type='range']:hover { background: #383838; }
                audio { width: 100%; }
                audio::-webkit-media-controls-panel { background-color: #282828; }
                audio::-webkit-media-controls-play-button { background-color: #FF0000; border-radius: 50%; }
                audio::-webkit-media-controls-current-time-display, 
                audio::-webkit-media-controls-time-remaining-display,
                audio::-webkit-media-controls-mute-button,
                audio::-webkit-media-controls-volume-slider { color: #FFFFFF; }
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </section>
    );
};

export default TextToSpeech;