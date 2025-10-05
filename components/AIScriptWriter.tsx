import React, { useState, useRef, useEffect } from 'react';
import { 
    AiIcon, SpinnerIcon, WandIcon, ClipboardDocumentListIcon, SpeakerWaveIcon, CameraIcon, 
    MusicalNoteIcon, DownloadIcon, TranslateIcon, ChatBubbleLeftRightIcon, ImageIcon, 
    CheckIcon, SeoIcon 
} from './IconComponents';
import { generateScript, generateAudio, generateImages } from '../server/functions';

// Data structure for the generated script
interface ScriptSection {
    section_title: string;
    dialogue: string;
    visual_cue: string;
    sound_cue: string;
    generated_image_url?: string;
    generated_audio_url?: string;
}

interface GeneratedScript {
    title_options: string[];
    hook_options: string[];
    script_body: ScriptSection[];
    call_to_action: string;
}

const styles = [
    { value: 'documentary', name: 'Phim tài liệu' },
    { value: 'vlog', name: 'Vlog đời thường' },
    { value: 'comedic_skit', name: 'Tiểu phẩm hài' },
    { value: 'tutorial', name: 'Hướng dẫn (Tutorial)' },
    { value: 'unboxing', name: 'Mở hộp (Unboxing)' },
    { value: 'product_review', name: 'Đánh giá sản phẩm' },
    { value: 'cinematic_storytelling', name: 'Kể chuyện điện ảnh' },
    { value: 'audio_storytelling', name: 'Kể chuyện Audio (Podcast)' },
    { value: 'analysis_commentary', name: 'Phân tích / Bình luận' },
    { value: 'news_report', name: 'Phóng sự tin tức' },
    { value: 'educational_lecture', name: 'Bài giảng giáo dục' },
    { value: 'listicle', name: 'Video dạng Top list' },
];

const tones = [
    { value: 'humorous', name: 'Hài hước' },
    { value: 'formal', name: 'Trang trọng' },
    { value: 'inspirational', name: 'Truyền cảm hứng' },
    { value: 'dramatic', name: 'Kịch tính' },
    { value: 'sarcastic', name: 'Châm biếm' },
    { value: 'casual', name: 'Thân mật' },
    { value: 'energetic', name: 'Năng lượng' },
    { value: 'calm', name: 'Nhẹ nhàng, thư giãn' },
    { value: 'urgent', name: 'Khẩn trương' },
    { value: 'mysterious', name: 'Huyền bí' },
];

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'ko', name: 'Korean (한국어)' },
    { code: 'zh-CN', name: 'Chinese (简体中文)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
];

// Data structure for the user inputs
interface ScriptInputs {
    topic: string;
    style: string;
    tone: string;
    audience: string;
    keywords: string;
    lengthType: 'duration' | 'words';
    duration: number; // in minutes
    wordCount: number;
}

const AIScriptWriter: React.FC = () => {
    const [inputs, setInputs] = useState<ScriptInputs>({
        topic: '5 công cụ AI sẽ thay đổi cách chúng ta làm việc',
        style: 'educational_lecture',
        tone: 'energetic',
        audience: 'Các nhà sáng tạo nội dung, người làm marketing, và những người yêu công nghệ.',
        keywords: 'AI, công cụ AI, tương lai công việc, năng suất',
        lengthType: 'duration',
        duration: 5,
        wordCount: 800
    });
    const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [refineQuery, setRefineQuery] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    
    const [isTranslateOpen, setIsTranslateOpen] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const translateRef = useRef<HTMLDivElement>(null);

    const [generatingAssetForSection, setGeneratingAssetForSection] = useState<{ type: 'image' | 'audio', index: number } | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (translateRef.current && !translateRef.current.contains(event.target as Node)) {
                setIsTranslateOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['duration', 'wordCount'].includes(name);
        setInputs(prev => ({ 
            ...prev, 
            [name]: isNumeric ? parseInt(value, 10) : value 
        }));
    };

    const handleGenerateScript = async () => {
        if (!inputs.topic.trim()) { setError('Vui lòng nhập chủ đề chính.'); return; }
        setIsLoading(true); setError(null); setGeneratedScript(null);
        
        try {
            // Call simulated backend function
            const result = await generateScript(inputs);
            setGeneratedScript(result);
        } catch (e) {
            console.error(e); setError(`Đã xảy ra lỗi: ${e instanceof Error ? e.message : 'Lỗi không xác định.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefineScript = async (query: string) => {
        if (!query.trim() || !generatedScript) return;
        setIsRefining(true); setError(null);
        alert('Chức năng "Tinh chỉnh" đang được phát triển và sẽ sớm ra mắt!');
        // In a real app, you would call a backend function here like:
        // const result = await refineScript(generatedScript, query);
        // setGeneratedScript(result);
        setIsRefining(false);
        setRefineQuery('');
    };
    
    const handleTranslateScript = async (languageName: string) => {
        if (!generatedScript) return;
        setIsTranslating(true);
        setIsTranslateOpen(false);
        setError(null);
        alert(`Đang mô phỏng dịch sang ${languageName}... Chức năng này sẽ sớm hoạt động!`);
        // In a real app, you would call a backend function here like:
        // const result = await translateScript(generatedScript, languageName);
        // setGeneratedScript(result);
        setIsTranslating(false);
    };


    const handleGenerateImageForSection = async (visualCue: string, index: number) => {
        setGeneratingAssetForSection({ type: 'image', index });
        try {
            const imageUrls = await generateImages(visualCue, 1);
            if (imageUrls.length > 0) {
                setGeneratedScript(prev => {
                    if (!prev) return null;
                    const newScriptBody = [...prev.script_body];
                    newScriptBody[index].generated_image_url = imageUrls[0];
                    return { ...prev, script_body: newScriptBody };
                });
            }
        } catch (e) {
            console.error(e); setError(`Lỗi tạo ảnh: ${e instanceof Error ? e.message : 'Thử lại sau'}`);
        } finally {
            setGeneratingAssetForSection(null);
        }
    };

    const handleGenerateAudioForSection = async (dialogue: string, index: number) => {
        setGeneratingAssetForSection({ type: 'audio', index });
        try {
            const audioUrl = await generateAudio(dialogue, 'vi-VN-Wavenet-D', 1, 0);
            setGeneratedScript(prev => {
                if (!prev) return null;
                const newScriptBody = [...prev.script_body];
                newScriptBody[index].generated_audio_url = audioUrl;
                return { ...prev, script_body: newScriptBody };
            });
        } catch (e) {
            console.error(e); setError(`Lỗi tạo audio: ${e instanceof Error ? e.message : 'Thử lại sau'}`);
        } finally {
            setGeneratingAssetForSection(null);
        }
    };
    
    const getScriptAsText = () => {
        if (!generatedScript) return '';
        let scriptText = `TIÊU ĐỀ GỢI Ý:\n- ${generatedScript.title_options.join('\n- ')}\n\n`;
        scriptText += `HOOK GỢI Ý:\n- ${generatedScript.hook_options.join('\n- ')}\n\n---\n\n`;
        generatedScript.script_body.forEach(section => {
            scriptText += `\n[${section.section_title.toUpperCase()}]\n`;
            scriptText += `LỜI THOẠI: ${section.dialogue}\n`;
            scriptText += `HÌNH ẢNH: ${section.visual_cue}\n`;
            scriptText += `ÂM THANH: ${section.sound_cue}\n`;
        });
        scriptText += `\n[KÊU GỌI HÀNH ĐỘNG]\n${generatedScript.call_to_action}\n`;
        return scriptText;
    }

    const copyToClipboard = () => {
        const scriptText = getScriptAsText();
        if (!scriptText) return;
        navigator.clipboard.writeText(scriptText).then(() => {
            setCopySuccess('script');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
    
    const handleSaveAsTxt = () => {
        const scriptText = getScriptAsText();
        if (!scriptText) return;
        const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'yt-pro-script.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    return (
        <section id="script-writer-studio" className="py-20 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <AiIcon className="w-10 h-10 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main">YT Pro Script Studio v3.2</h2>
                    </div>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Từ ý tưởng đến kịch bản sản xuất hoàn chỉnh với storyboard, voiceover demo và cầu nối SEO.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Control Panel */}
                    <div className="lg:col-span-1 bg-card border border-secondary rounded-xl p-6 self-start space-y-4">
                        <h3 className="text-xl font-bold text-text-main">Bảng Điều Khiển Sáng Tạo</h3>
                        <div>
                            <label className="font-semibold text-text-main mb-2 block">1. Chủ đề chính</label>
                            <textarea name="topic" value={inputs.topic} onChange={handleInputChange} rows={3} placeholder="Ví dụ: Cách làm một video YouTube viral" className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-text-main mb-2 block">2. Phong cách</label>
                                <select name="style" value={inputs.style} onChange={handleInputChange} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading}>
                                    {styles.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold text-text-main mb-2 block">3. Tông giọng</label>
                                <select name="tone" value={inputs.tone} onChange={handleInputChange} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading}>
                                    {tones.map(t => <option key={t.value} value={t.value}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold text-text-main mb-2 block">4. Độ dài kịch bản</label>
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center gap-2"><input type="radio" name="lengthType" value="duration" checked={inputs.lengthType === 'duration'} onChange={handleInputChange} disabled={isLoading} className="text-primary focus:ring-primary"/> Thời lượng</label>
                                <label className="flex items-center gap-2"><input type="radio" name="lengthType" value="words" checked={inputs.lengthType === 'words'} onChange={handleInputChange} disabled={isLoading} className="text-primary focus:ring-primary"/> Số từ</label>
                            </div>
                            {inputs.lengthType === 'duration' ? (
                                <div className="flex items-center gap-2">
                                    <input type="range" name="duration" min="1" max="120" value={inputs.duration} onChange={handleInputChange} disabled={isLoading} className="w-full"/>
                                    <input type="number" name="duration" value={inputs.duration} onChange={handleInputChange} disabled={isLoading} className="w-20 bg-background border border-secondary rounded-lg p-2 text-center"/>
                                    <span>phút</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input type="range" name="wordCount" min="100" max="20000" step="50" value={inputs.wordCount} onChange={handleInputChange} disabled={isLoading} className="w-full"/>
                                    <input type="number" name="wordCount" value={inputs.wordCount} onChange={handleInputChange} disabled={isLoading} className="w-24 bg-background border border-secondary rounded-lg p-2 text-center"/>
                                    <span>từ</span>
                                </div>
                            )}
                        </div>
                        <div>
                             <label className="font-semibold text-text-main mb-2 block">5. Thông tin bổ sung</label>
                             <div className="space-y-3">
                                <input type="text" name="audience" value={inputs.audience} onChange={handleInputChange} placeholder="Đối tượng khán giả..." className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                                <input type="text" name="keywords" value={inputs.keywords} onChange={handleInputChange} placeholder="Từ khóa SEO..." className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                             </div>
                        </div>
                         <button onClick={handleGenerateScript} disabled={isLoading || isRefining || isTranslating} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2">
                             {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <WandIcon className="w-6 h-6" />}
                             <span>{isLoading ? 'Đang viết...' : 'Tạo Kịch Bản'}</span>
                         </button>
                    </div>

                    {/* Script Stage */}
                    <div className="lg:col-span-2 bg-card border border-secondary rounded-xl p-6 min-h-[600px] flex flex-col">
                        {isLoading ? (
                             <div className="flex flex-col items-center justify-center h-full text-text-secondary flex-grow">
                                <SpinnerIcon className="w-12 h-12 text-primary animate-spin" />
                                <p className="mt-4">AI đang sáng tạo, vui lòng chờ trong giây lát...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full text-red-400 text-center flex-grow">
                                <h4 className="font-bold text-lg mb-2">Đã xảy ra lỗi</h4>
                                <p>{error}</p>
                            </div>
                        ) : !generatedScript ? (
                            <div className="flex flex-col items-center justify-center h-full text-text-secondary text-center flex-grow">
                                <WandIcon className="w-16 h-16 mb-4"/>
                                <h3 className="text-xl font-bold text-text-main mb-2">Sân Khấu Kịch Bản</h3>
                                <p>Điền thông tin và nhấn "Tạo Kịch Bản" để bắt đầu.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in flex flex-col flex-grow">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-2xl font-bold text-primary">Kịch Bản Của Bạn</h3>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={handleSaveAsTxt} title="Tải về .txt" className="p-2 bg-secondary hover:bg-gray-700 text-text-main rounded-lg transition-colors"><DownloadIcon className="w-5 h-5"/></button>
                                        <button onClick={copyToClipboard} title="Sao chép" className="p-2 bg-secondary hover:bg-gray-700 text-text-main rounded-lg transition-colors">
                                            {copySuccess === 'script' ? <CheckIcon className="w-5 h-5 text-green-500"/> : <ClipboardDocumentListIcon className="w-5 h-5"/>}
                                        </button>
                                        <div className="relative" ref={translateRef}>
                                            <button onClick={() => setIsTranslateOpen(prev => !prev)} disabled={isTranslating} title="Dịch" className="p-2 bg-secondary hover:bg-gray-700 text-text-main rounded-lg transition-colors disabled:opacity-50">
                                                {isTranslating ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : <TranslateIcon className="w-5 h-5"/>}
                                            </button>
                                            {isTranslateOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-card border border-secondary rounded-lg shadow-lg z-10">
                                                    {languages.map(lang => (
                                                        <button key={lang.code} onClick={() => handleTranslateScript(lang.name)} className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-secondary">
                                                            {lang.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-text-main">Lựa chọn Tiêu đề:</h4>
                                    <div className="flex flex-wrap gap-2">{generatedScript.title_options.map((title, i) => <span key={i} className="bg-background border border-secondary px-3 py-1 rounded-full text-sm text-text-secondary">{title}</span>)}</div>
                                </div>
                                 <div className="space-y-2">
                                    <h4 className="font-bold text-text-main">Lựa chọn Mở đầu (Hook):</h4>
                                    <div className="flex flex-wrap gap-2">{generatedScript.hook_options.map((hook, i) => <span key={i} className="bg-background border border-secondary px-3 py-1 rounded-full text-sm text-text-secondary">{hook}</span>)}</div>
                                </div>
                                <div className="space-y-6 pt-4 border-t border-secondary overflow-y-auto flex-grow max-h-[50vh]">
                                    {generatedScript.script_body.map((section, i) => (
                                        <div key={i} className="bg-background border border-secondary/50 rounded-lg p-4 space-y-4">
                                            <h4 className="text-lg font-bold text-text-main">{section.section_title}</h4>
                                            
                                            <div className="flex items-start gap-3">
                                                <SpeakerWaveIcon className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
                                                <div className="w-full">
                                                    <p className="text-text-secondary">{section.dialogue}</p>
                                                    {section.generated_audio_url ? (
                                                        <audio src={section.generated_audio_url} controls className="mt-2 w-full h-8" />
                                                    ) : (
                                                    <button onClick={() => handleGenerateAudioForSection(section.dialogue, i)} disabled={!!generatingAssetForSection} className="text-xs mt-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 py-1 px-2 rounded-md inline-flex items-center gap-1">
                                                        {generatingAssetForSection?.type === 'audio' && generatingAssetForSection.index === i ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <SpeakerWaveIcon className="w-4 h-4"/>}
                                                        Tạo giọng đọc
                                                    </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <CameraIcon className="w-5 h-5 text-rose-400 mt-1 flex-shrink-0" />
                                                <div className="w-full">
                                                    <p className="text-text-secondary text-sm italic">{section.visual_cue}</p>
                                                    {section.generated_image_url ? (
                                                        <img src={section.generated_image_url} alt={`Visual for ${section.section_title}`} className="mt-2 rounded-md w-full aspect-video object-cover"/>
                                                    ) : (
                                                    <button onClick={() => handleGenerateImageForSection(section.visual_cue, i)} disabled={!!generatingAssetForSection} className="text-xs mt-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 py-1 px-2 rounded-md inline-flex items-center gap-1">
                                                        {generatingAssetForSection?.type === 'image' && generatingAssetForSection.index === i ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4"/>}
                                                        Tạo ảnh
                                                    </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3"><MusicalNoteIcon className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" /><p className="text-text-secondary text-sm italic">{section.sound_cue}</p></div>
                                        </div>
                                    ))}
                                    <div>
                                        <h4 className="text-lg font-bold text-text-main mb-2">Kêu gọi hành động:</h4>
                                        <p className="text-text-secondary bg-background border border-secondary/50 rounded-lg p-4">{generatedScript.call_to_action}</p>
                                    </div>
                                    
                                    {/* SEO Redirect Section */}
                                    <div className="bg-background border border-secondary/50 rounded-lg p-4">
                                        <h4 className="text-lg font-bold text-text-main mb-3">Tối ưu hóa SEO</h4>
                                         <button onClick={() => alert('Chuyển hướng đến công cụ SEO chuyên sâu (đang phát triển)...')} className="w-full bg-accent/20 text-accent font-semibold py-2 rounded-lg hover:bg-accent/30 transition-colors inline-flex items-center justify-center gap-2">
                                            <SeoIcon className="w-5 h-5"/>
                                            SEO Kịch Bản
                                        </button>
                                    </div>
                                </div>
                                {/* Refinement Section */}
                                <div className="mt-auto pt-6 border-t border-secondary">
                                    <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2"><ChatBubbleLeftRightIcon className="w-6 h-6 text-accent"/>Trợ lý Tinh chỉnh</h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleRefineScript('Làm cho kịch bản này ngắn gọn và súc tích hơn.')} disabled={isRefining} className="text-xs bg-secondary hover:bg-gray-700 py-1 px-3 rounded-full disabled:opacity-50">Làm ngắn gọn</button>
                                            <button onClick={() => handleRefineScript('Thêm nhiều yếu tố hài hước và dí dỏm vào kịch bản.')} disabled={isRefining} className="text-xs bg-secondary hover:bg-gray-700 py-1 px-3 rounded-full disabled:opacity-50">Thêm hài hước</button>
                                            <button onClick={() => handleRefineScript('Kiểm tra và đảm bảo các nhân vật (nếu có) được nhất quán trong toàn bộ kịch bản.')} disabled={isRefining} className="text-xs bg-secondary hover:bg-gray-700 py-1 px-3 rounded-full disabled:opacity-50">Đồng nhất nhân vật</button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="text" value={refineQuery} onChange={e => setRefineQuery(e.target.value)} placeholder="Yêu cầu AI tinh chỉnh kịch bản..." className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isRefining}/>
                                            <button onClick={() => handleRefineScript(refineQuery)} disabled={isRefining || !refineQuery.trim()} className="bg-accent text-white font-semibold py-3 px-5 rounded-lg disabled:bg-gray-600">
                                                {isRefining ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : 'Gửi'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; background: #282828; border-radius: 5px; outline: none; }
                input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #FF0000; cursor: pointer; border-radius: 50%; }
                input[type='radio'] { -webkit-appearance: none; appearance: none; background-color: #1E1E1E; margin: 0; font: inherit; color: currentColor; width: 1.15em; height: 1.15em; border: 0.15em solid currentColor; border-radius: 50%; transform: translateY(-0.075em); display: grid; place-content: center; }
                input[type='radio']::before { content: ""; width: 0.65em; height: 0.65em; border-radius: 50%; transform: scale(0); transition: 120ms transform ease-in-out; box-shadow: inset 1em 1em #FF0000; }
                input[type='radio']:checked::before { transform: scale(1); }
                audio::-webkit-media-controls-panel { background-color: #282828; }
                audio::-webkit-media-controls-play-button { background-color: #FF0000; border-radius: 50%; }
                audio::-webkit-media-controls-current-time-display, audio::-webkit-media-controls-time-remaining-display { color: #FFFFFF; }
            `}</style>
        </section>
    );
};

export default AIScriptWriter;