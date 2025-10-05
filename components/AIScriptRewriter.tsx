import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
    RefreshIcon, 
    SpinnerIcon, 
    FireIcon,
    SeoIcon,
    AiIcon as SparklesIcon,
    FaceSmileIcon,
    ClipboardIcon,
    CheckIcon,
    ChartIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon
} from './IconComponents';

type Lens = 'viralize' | 'clarify' | 'seo' | 'custom';

interface AnalysisResult {
    rewritten_script: string;
    analysis: {
        viral_potential_score: number;
        key_improvements: string[];
        original_reading_time_seconds: number;
        rewritten_reading_time_seconds: number;
    };
}

// Data copied from AIScriptWriter for consistency
const styles = [
    { value: 'default', name: 'Mặc định (Giữ nguyên)' },
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
    { value: 'default', name: 'Mặc định (Giữ nguyên)' },
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

const lengthOptions: { value: string, name: string }[] = [
    { value: 'default', name: 'Bằng kịch bản cũ' },
    { value: 'shorter_less', name: 'Ngắn hơn ít' },
    { value: 'shorter_more', name: 'Ngắn hơn nhiều' },
    { value: 'longer_less', name: 'Dài hơn ít' },
    { value: 'longer_more', name: 'Dài hơn nhiều' },
    { value: 'specific', name: 'Thời lượng cụ thể (phút)' },
];


const lenses: { id: Lens; name: string; icon: React.ReactNode; description: string }[] = [
    { id: 'viralize', name: 'Viralize', icon: <FireIcon className="w-5 h-5" />, description: 'Tối ưu hook, nhịp độ và CTA để tăng khả năng lan truyền.' },
    { id: 'clarify', name: 'Làm rõ', icon: <SparklesIcon className="w-5 h-5" />, description: 'Đơn giản hóa câu từ, loại bỏ thuật ngữ khó hiểu.' },
    { id: 'seo', name: 'Tăng SEO', icon: <SeoIcon className="w-5 h-5" />, description: 'Chèn từ khóa một cách tự nhiên để cải thiện thứ hạng.' },
    { id: 'custom', name: 'Tùy chỉnh', icon: <FaceSmileIcon className="w-5 h-5" />, description: 'Sử dụng các tùy chọn nâng cao để điều khiển chính xác.' },
];


const AIScriptRewriter: React.FC = () => {
    const [originalScript, setOriginalScript] = useState('Chào mọi người, hôm nay chúng ta sẽ nói về các công cụ AI. AI rất quan trọng. Nó giúp chúng ta làm việc tốt hơn. Đầu tiên là công cụ A, nó giúp làm X. Tiếp theo là công cụ B, nó giúp làm Y. Cảm ơn đã xem.');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeLens, setActiveLens] = useState<Lens>('viralize');
    
    // Advanced controls state
    const [keywords, setKeywords] = useState('công cụ AI, năng suất, tương lai công việc');
    const [selectedStyle, setSelectedStyle] = useState('default');
    const [selectedTone, setSelectedTone] = useState('default');
    const [lengthAdjustment, setLengthAdjustment] = useState('default');
    const [targetDuration, setTargetDuration] = useState<number>(5);

    // Refinement state
    const [refineQuery, setRefineQuery] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    const [copySuccess, setCopySuccess] = useState(false);
    
    const callGeminiForRewrite = async (prompt: string): Promise<AnalysisResult> => {
        const apiKey = window.process?.env?.API_KEY;
        if (!apiKey) throw new Error('API Key chưa được cấu hình.');
        const ai = new GoogleGenAI({ apiKey });

        const analysisSchema = {
            type: Type.OBJECT,
            properties: {
                rewritten_script: { type: Type.STRING, description: 'Toàn bộ kịch bản đã được viết lại dưới dạng một chuỗi duy nhất.' },
                analysis: {
                    type: Type.OBJECT,
                    properties: {
                        viral_potential_score: { type: Type.INTEGER, description: 'Điểm từ 1-100 đánh giá khả năng lan truyền của kịch bản mới.' },
                        key_improvements: { type: Type.ARRAY, description: 'Một danh sách các điểm chuỗi giải thích những thay đổi quan trọng nhất đã được thực hiện.', items: { type: Type.STRING } },
                        original_reading_time_seconds: { type: Type.INTEGER, description: 'Thời gian đọc ước tính của kịch bản gốc tính bằng giây.' },
                        rewritten_reading_time_seconds: { type: Type.INTEGER, description: 'Thời gian đọc ước tính của kịch bản mới tính bằng giây.' },
                    },
                    required: ['viral_potential_score', 'key_improvements', 'original_reading_time_seconds', 'rewritten_reading_time_seconds']
                },
            },
            required: ['rewritten_script', 'analysis']
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: analysisSchema
            }
        });
        if (!response.text) throw new Error('AI không trả về kết quả hợp lệ.');
        return JSON.parse(response.text);
    };

    const handleRewrite = async () => {
        if (!originalScript.trim()) { setError('Vui lòng dán kịch bản gốc.'); return; }
        setIsLoading(true); setError(null); setAnalysisResult(null);

        let lensSpecificPrompt = '';
        switch (activeLens) {
            case 'viralize': lensSpecificPrompt = 'Tập trung vào việc tạo ra một "hook" không thể cưỡng lại trong 15 giây đầu. Tăng nhịp độ, xây dựng sự tò mò và kết thúc bằng lời kêu gọi hành động (CTA) mạnh mẽ.'; break;
            case 'clarify': lensSpecificPrompt = 'Viết lại kịch bản này để đạt được sự rõ ràng và súc tích tối đa. Đơn giản hóa các câu phức tạp, loại bỏ biệt ngữ.'; break;
            case 'seo': lensSpecificPrompt = `Viết lại kịch bản này để kết hợp một cách tự nhiên các từ khóa SEO sau: "${keywords}". Các từ khóa phải cảm thấy hữu cơ và không bị ép buộc.`; break;
            case 'custom': lensSpecificPrompt = 'Viết lại kịch bản dựa trên các tùy chỉnh nâng cao được cung cấp.'; break;
        }
        
        const lengthAdjustmentMap: { [key: string]: string } = {
            default: 'Giữ nguyên độ dài tương đương với kịch bản gốc.',
            shorter_less: 'Điều chỉnh kịch bản để nó ngắn hơn một chút so với bản gốc.',
            shorter_more: 'Điều chỉnh kịch bản để nó ngắn hơn đáng kể (rút gọn nhiều) so với bản gốc.',
            longer_less: 'Điều chỉnh kịch bản để nó dài hơn một chút so với bản gốc, thêm chi tiết hoặc ví dụ.',
            longer_more: 'Điều chỉnh kịch bản để nó dài hơn đáng kể so với bản gốc, mở rộng ý tưởng và thêm nội dung mới.',
        };

        const advancedCustomizations = [
            selectedStyle !== 'default' && `Thay đổi phong cách kịch bản thành: '${styles.find(s=>s.value === selectedStyle)?.name}'.`,
            selectedTone !== 'default' && `Thay đổi tông giọng của kịch bản thành: '${tones.find(t=>t.value === selectedTone)?.name}'.`,
            lengthAdjustment !== 'default' && lengthAdjustment !== 'specific' && lengthAdjustmentMap[lengthAdjustment],
            lengthAdjustment === 'specific' && `Điều chỉnh kịch bản để có thời lượng video khoảng ${targetDuration} phút.`
        ].filter(Boolean).join(' ');

        try {
            const prompt = `
            VAI TRÒ: Bạn là 'ScriptCraft AI', chuyên gia biên tập kịch bản YouTube.
            NHIỆM VỤ: Phân tích và viết lại 'Kịch bản gốc' dựa trên 'Mục tiêu chính' và 'Tùy chỉnh nâng cao'.
            
            MỤC TIÊU CHÍNH (LĂNG KÍNH): ${lenses.find(l => l.id === activeLens)?.name} - ${lensSpecificPrompt}
            ${advancedCustomizations ? `\nCÁC TÙY CHỈNH NÂNG CAO:\n${advancedCustomizations}` : ''}

            QUY TẮC:
            1. Bắt buộc trả về một đối tượng JSON hợp lệ duy nhất tuân thủ schema.
            2. Phân tích phải sâu sắc, giải thích những cải tiến đã thực hiện.

            KỊCH BẢN GỐC:
            """
            ${originalScript}
            """`;
            
            const result = await callGeminiForRewrite(prompt);
            setAnalysisResult(result);
        } catch (e) {
            console.error(e);
            setError(`Đã xảy ra lỗi: ${e instanceof Error ? e.message : 'Kiểm tra API key và thử lại.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefineWithChat = async () => {
        if (!refineQuery.trim() || !analysisResult) return;
        setIsRefining(true); setError(null);

        try {
            const prompt = `
            VAI TRÒ: Bạn là 'ScriptCraft AI'.
            NHIỆM VỤ: Bạn đã viết lại một kịch bản. Bây giờ, hãy tinh chỉnh nó thêm một lần nữa dựa trên yêu cầu của người dùng.
            
            YÊU CẦU TINH CHỈNH: "${refineQuery}"

            KỊCH BẢN HIỆN TẠI ĐỂ TINH CHỈNH:
            """
            ${analysisResult.rewritten_script}
            """
            
            QUY TẮC:
            1. Áp dụng yêu cầu tinh chỉnh vào kịch bản hiện tại.
            2. Tạo lại toàn bộ đối tượng JSON (với kịch bản mới và phân tích mới) theo schema đã cung cấp.
            `;
            
            const result = await callGeminiForRewrite(prompt);
            setAnalysisResult(result);
            setRefineQuery('');
        } catch(e) {
            console.error(e);
            setError(`Lỗi tinh chỉnh: ${e instanceof Error ? e.message : 'Không thể hoàn thành.'}`);
        } finally {
            setIsRefining(false);
        }
    };
    
    const copyToClipboard = () => {
        if (!analysisResult) return;
        navigator.clipboard.writeText(analysisResult.rewritten_script).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    return (
        <section id="script-rewriter" className="py-20 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-12">
                     <div className="flex justify-center items-center gap-4 mb-4">
                        <RefreshIcon className="w-10 h-10 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main">Script Polishing Lab v2.2</h2>
                    </div>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Biến kịch bản của bạn thành một tác phẩm viral. Chọn "lăng kính", tùy chỉnh chi tiết, và tinh chỉnh bằng chat.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto bg-card border border-secondary rounded-xl p-8 space-y-8">
                    {/* Control Deck */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-background/50 border border-secondary rounded-lg p-4 space-y-3">
                            <h3 className="text-lg font-semibold text-text-main">1. Chọn Lăng Kính (Mục tiêu chính)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {lenses.map(lens => (
                                    <button key={lens.id} onClick={() => setActiveLens(lens.id)}
                                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 text-center transition-all duration-200 ${activeLens === lens.id ? 'border-primary bg-primary/10 text-primary' : 'border-secondary bg-background hover:border-gray-600 text-text-secondary'}`}>
                                        {lens.icon} <span className="font-semibold text-sm">{lens.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-md text-center text-sm text-text-secondary">
                                {lenses.find(l => l.id === activeLens)?.description}
                            </div>
                            {activeLens === 'seo' && (
                                 <div className="animate-fade-in">
                                    <label className="font-semibold text-text-main mb-2 block text-sm">Từ khóa SEO (phân cách bằng dấu phẩy)</label>
                                    <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} className="w-full bg-background border border-secondary rounded-lg p-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                            )}
                        </div>
                        <div className="bg-background/50 border border-secondary rounded-lg p-4 space-y-3">
                            <h3 className="text-lg font-semibold text-text-main">2. Tùy chỉnh Nâng cao (Tùy chọn)</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold text-text-main mb-2 block text-sm">Phong cách</label>
                                    <select value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)} className="w-full bg-background border border-secondary rounded-lg p-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary">
                                        {styles.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold text-text-main mb-2 block text-sm">Tông giọng</label>
                                    <select value={selectedTone} onChange={e => setSelectedTone(e.target.value)} className="w-full bg-background border border-secondary rounded-lg p-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary">
                                        {tones.map(t => <option key={t.value} value={t.value}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="font-semibold text-text-main mb-2 block text-sm">Điều chỉnh độ dài</label>
                                <select value={lengthAdjustment} onChange={e => setLengthAdjustment(e.target.value)} className="w-full bg-background border border-secondary rounded-lg p-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary">
                                    {lengthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
                                </select>
                                {lengthAdjustment === 'specific' && (
                                    <div className="flex items-center gap-2 mt-2 animate-fade-in">
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="120" 
                                            value={targetDuration} 
                                            onChange={(e) => setTargetDuration(parseInt(e.target.value, 10))}
                                            className="w-full"
                                        />
                                        <input 
                                            type="number" 
                                            min="1"
                                            max="120"
                                            value={targetDuration} 
                                            onChange={(e) => setTargetDuration(parseInt(e.target.value, 10))}
                                            className="w-20 bg-background border border-secondary rounded-lg p-2 text-center"
                                        />
                                        <span>phút</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Script Panes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-text-main mb-2">3. Kịch bản gốc</h3>
                            <textarea value={originalScript} onChange={(e) => setOriginalScript(e.target.value)} placeholder="Dán kịch bản của bạn vào đây..." className="w-full h-96 bg-background border border-secondary rounded-lg p-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading}/>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-text-main">4. Phiên bản đã cải tiến</h3>
                                {analysisResult && <button onClick={copyToClipboard} className="flex items-center gap-2 text-sm text-accent hover:text-orange-400">{copySuccess ? <><CheckIcon className="w-5 h-5"/> Đã sao chép!</> : <><ClipboardIcon className="w-5 h-5"/> Sao chép</>}</button>}
                            </div>
                            <div className="w-full h-96 bg-background border border-secondary rounded-lg p-4 text-text-secondary whitespace-pre-wrap overflow-y-auto">
                                {isLoading ? <div className="flex items-center justify-center h-full flex-col gap-4"><SpinnerIcon className="w-10 h-10 text-primary animate-spin" /><p>AI đang phân tích và viết lại...</p></div> : (analysisResult?.rewritten_script || "Kết quả sẽ xuất hiện ở đây...")}
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <button onClick={handleRewrite} disabled={isLoading || isRefining} className="bg-primary text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-3">
                            {isLoading ? <SpinnerIcon className="w-7 h-7 animate-spin" /> : <RefreshIcon className="w-7 h-7" />}
                            <span>{isLoading ? 'Đang xử lý...' : 'Áp Dụng & Viết Lại'}</span>
                        </button>
                        {error && <p className="text-red-400 mt-4 text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}
                    </div>

                    {analysisResult && !isLoading && (
                        <div className="animate-fade-in pt-8 border-t border-secondary space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-text-main mb-4 text-center">Bảng Phân Tích của AI</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-background/50 border border-secondary rounded-lg p-4 flex flex-col items-center text-center"><h4 className="font-semibold text-text-secondary mb-2">Điểm Viral Tiềm Năng</h4><div className="relative w-24 h-24"><svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path><path className="text-primary" strokeDasharray={`${analysisResult.analysis.viral_potential_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path></svg><div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-text-main">{analysisResult.analysis.viral_potential_score}</div></div></div>
                                    <div className="bg-background/50 border border-secondary rounded-lg p-4 flex flex-col items-center text-center"><h4 className="font-semibold text-text-secondary mb-2">Thời gian đọc ước tính</h4><div className="flex items-baseline gap-4 mt-2"><div><div className="text-2xl font-bold text-text-secondary">{analysisResult.analysis.original_reading_time_seconds}s</div><div className="text-xs">Gốc</div></div><div className="text-primary font-bold text-xl">&rarr;</div><div><div className="text-2xl font-bold text-text-main">{analysisResult.analysis.rewritten_reading_time_seconds}s</div><div className="text-xs">Mới</div></div></div></div>
                                    <div className="bg-background/50 border border-secondary rounded-lg p-4"><h4 className="font-semibold text-text-secondary mb-3 text-center">Các Cải Tiến Chính</h4><ul className="space-y-2 text-sm">{analysisResult.analysis.key_improvements.map((item, i) => (<li key={i} className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/><span className="text-text-secondary">{item}</span></li>))}</ul></div>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-secondary/50">
                                <h3 className="text-xl font-bold text-text-main mb-3 flex items-center gap-2 justify-center"><ChatBubbleLeftRightIcon className="w-6 h-6 text-accent"/>Trợ lý Tinh chỉnh</h3>
                                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                                    <input type="text" value={refineQuery} onChange={e => setRefineQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRefineWithChat()} placeholder="Yêu cầu AI tinh chỉnh thêm (VD: làm cho đoạn kết mạnh mẽ hơn)" className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isRefining}/>
                                    <button onClick={handleRefineWithChat} disabled={isRefining || !refineQuery.trim()} className="bg-accent text-white font-semibold py-3 px-5 rounded-lg disabled:bg-gray-600 flex-shrink-0">
                                        {isRefining ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : 'Gửi'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; background: #282828; border-radius: 5px; outline: none; }
                input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #FF0000; cursor: pointer; border-radius: 50%; }
            `}</style>
        </section>
    );
};

export default AIScriptRewriter;