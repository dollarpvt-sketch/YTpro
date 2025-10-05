import React, { useState, useRef, useEffect } from 'react';
import { 
    SpeakerWaveIcon, SpinnerIcon, PlayIcon, PauseIcon, DownloadIcon, PlusIcon, 
    TrashIcon, ChevronDownIcon, AdjustmentsHorizontalIcon, InformationCircleIcon, AiIcon
} from './IconComponents';
import { GoogleGenAI } from "@google/genai";

// Component to represent the Stop icon
const StopIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
    </svg>
);


const TextToSpeech: React.FC = () => {
    const [script, setScript] = useState('Chào mừng đến với YT Pro Tools. Công cụ này giờ đây sử dụng giọng đọc có sẵn trên trình duyệt của bạn để phát ra âm thanh ngay lập tức. Hãy thử nhấn nút "Đọc" xem sao!');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    
    const [status, setStatus] = useState<'idle' | 'speaking' | 'paused'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // We need a ref to the utterance to handle pause/resume correctly across re-renders
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Populate voices when the component mounts
    useEffect(() => {
        const populateVoiceList = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0) {
                // Try to find a Vietnamese voice by default
                const vietnameseVoice = availableVoices.find(voice => voice.lang.startsWith('vi'));
                setSelectedVoice(vietnameseVoice || availableVoices[0]);
            }
        };

        populateVoiceList();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
        }

        // Cleanup function to cancel speech if component unmounts
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handlePlay = () => {
        if (!script.trim()) {
            setError('Vui lòng nhập kịch bản.');
            return;
        }
        if (!selectedVoice) {
            setError('Không tìm thấy giọng đọc nào trên thiết bị của bạn.');
            return;
        }
        
        // Cancel any previous speech before starting a new one
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(script);
        utterance.voice = selectedVoice;
        utterance.pitch = pitch;
        utterance.rate = rate;

        utterance.onstart = () => {
            setStatus('speaking');
            setError(null);
        };
        utterance.onpause = () => setStatus('paused');
        utterance.onresume = () => setStatus('speaking');
        utterance.onend = () => setStatus('idle');
        utterance.onerror = (event) => {
            setError(`Lỗi phát âm: ${event.error}`);
            setStatus('idle');
        };
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
    };

    const handleResume = () => {
        window.speechSynthesis.resume();
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setStatus('idle');
    };
    
    const handleVoiceChange = (voiceURI: string) => {
        const voice = voices.find(v => v.voiceURI === voiceURI);
        if (voice) {
            setSelectedVoice(voice);
        }
    };

    const handleAiAnalysis = async () => {
        if (!script.trim()) {
            setError('Vui lòng nhập kịch bản để AI phân tích.'); return;
        }
        setIsAnalyzing(true); setAiSuggestions([]); setError(null);
        
        try {
            const apiKey = window.process?.env?.API_KEY;
            if (!apiKey) throw new Error('API Key chưa được cấu hình.');
            const ai = new GoogleGenAI({ apiKey });

            const prompt = `Bạn là một đạo diễn lồng tiếng AI. Phân tích kịch bản sau đây và đưa ra 3-5 gợi ý cụ thể để làm cho giọng đọc trở nên hấp dẫn hơn. Tập trung vào nhịp độ, nhấn nhá, và cảm xúc. Trả lời bằng tiếng Việt.
            Kịch bản: "${script}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            
            const suggestionsText = response.text;
            if (suggestionsText) {
                setAiSuggestions(suggestionsText.split('\n').filter(line => line.match(/^(\d+\.|\*|-)\s/)).map(line => line.replace(/^(\d+\.|\*|-)\s/, '')));
            } else {
                throw new Error("AI không đưa ra được gợi ý nào.");
            }

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
                        Tạo giọng đọc chuyên nghiệp với khả năng kiểm soát đa giọng nói, nhịp điệu và cảm xúc.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Script & AI Analysis Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-secondary rounded-xl p-6">
                             <h3 className="text-xl font-bold text-text-main mb-4">Kịch bản</h3>
                             <textarea
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                                placeholder="Dán kịch bản của bạn vào đây..."
                                className="w-full h-64 bg-background border border-secondary rounded-lg p-4 text-text-main text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={status !== 'idle'}
                            />
                        </div>
                        <div className="bg-card border border-secondary rounded-xl p-6">
                             <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><AiIcon className="w-6 h-6 text-accent"/>Đạo diễn lồng tiếng AI</h3>
                                <button onClick={handleAiAnalysis} disabled={isAnalyzing || status !== 'idle'} className="bg-accent/20 text-accent font-semibold py-2 px-4 rounded-lg hover:bg-accent/30 transition-colors text-sm disabled:opacity-50">
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

                    {/* Studio Controls Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card border border-secondary rounded-xl p-6 self-start">
                            <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><AdjustmentsHorizontalIcon className="w-6 h-6"/>Bảng điều khiển Studio</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="font-semibold text-text-secondary">Giọng đọc</label>
                                     <select 
                                        value={selectedVoice?.voiceURI || ''} 
                                        onChange={e => handleVoiceChange(e.target.value)} 
                                        className="w-full bg-secondary border border-secondary/50 rounded p-2 text-text-secondary text-sm focus:outline-none focus:ring-1 focus:ring-primary mt-2"
                                        disabled={voices.length === 0 || status !== 'idle'}
                                    >
                                        {voices.length > 0 ? (
                                            voices
                                                .filter(v => v.lang.startsWith('vi') || v.lang.startsWith('en'))
                                                .map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)
                                        ) : (
                                            <option>Đang tải giọng đọc...</option>
                                        )}
                                     </select>
                                </div>
                                <div>
                                    <label className="font-semibold text-text-secondary">Tốc độ nói</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full" disabled={status !== 'idle'}/>
                                        <span className="text-text-main font-mono w-12 text-center">{rate.toFixed(1)}x</span>
                                    </div>
                                </div>
                                 <div>
                                    <label className="font-semibold text-text-secondary">Cao độ</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full" disabled={status !== 'idle'}/>
                                        <span className="text-text-main font-mono w-12 text-center">{pitch.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-secondary rounded-xl p-4 self-start">
                             <div className="grid grid-cols-2 gap-3">
                                {status === 'idle' && (
                                    <button onClick={handlePlay} className="col-span-2 bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                                        <PlayIcon className="w-6 h-6"/> Đọc
                                    </button>
                                )}
                                {status === 'speaking' && (
                                    <button onClick={handlePause} className="bg-amber-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors">
                                        <PauseIcon className="w-6 h-6"/> Tạm dừng
                                    </button>
                                )}
                                {status === 'paused' && (
                                    <button onClick={handleResume} className="bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                                        <PlayIcon className="w-6 h-6"/> Đọc tiếp
                                    </button>
                                )}
                                {(status === 'speaking' || status === 'paused') && (
                                    <button onClick={handleStop} className="bg-secondary text-text-main font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors">
                                        <StopIcon className="w-6 h-6"/> Dừng
                                    </button>
                                )}
                             </div>
                        </div>
                        {error && <p className="text-red-400 text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}
                    </div>
                </div>

            </div>
             <style>{`
                input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; background: #282828; border-radius: 5px; outline: none; transition: background 0.2s; }
                input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #FF0000; cursor: pointer; border-radius: 50%; border: 3px solid #1E1E1E; }
                input[type='range']:hover { background: #383838; }
            `}</style>
        </section>
    );
};

export default TextToSpeech;
