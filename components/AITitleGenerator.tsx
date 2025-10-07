import React, { useState } from 'react';
import { 
    SeoIcon, SpinnerIcon, ClipboardIcon, CheckIcon, ChartIcon, WandIcon, DocumentTextIcon, KeyIcon, ImageIcon, FaceSmileIcon, DownloadIcon
} from './IconComponents';
import { generateOverallSEO, OverallSEOResult, OverallSEOInputs, generateImages } from '../server/functions';

const checklistLabels: { [key: string]: string } = {
    keywordRepetition: 'Từ khóa lặp lại 3 lần',
    keywordsInTitle: 'Từ khóa trong tiêu đề',
    keywordsInDescription: 'Từ khóa trong mô tả',
    tagCount: 'Lượng thẻ tag tổng',
    performance: 'Hiệu suất (Performance)',
    rankingTags: 'Tags có khả năng xếp hạng',
    highVolumeTags: 'Tags có lượng tìm kiếm cao',
};

interface ThumbnailState {
    imageUrl?: string;
    isLoading: boolean;
}

const OverallSEO: React.FC = () => {
    const [inputs, setInputs] = useState<OverallSEOInputs>({
        topic: 'Cách để bắt đầu một kênh YouTube thành công từ con số 0 vào năm 2024',
        keywords: 'youtube, người mới bắt đầu, tăng trưởng kênh, kiếm tiền youtube',
        channelLink: 'https://www.youtube.com/channel/your-channel-id',
        businessEmail: 'contact@your-business.com',
        targetAudience: 'Người mới làm YouTube, sinh viên, người muốn kiếm tiền online',
        desiredEmotion: 'Tò mò, Hứng thú, Tin tưởng',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<OverallSEOResult | null>(null);
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const [thumbnailStates, setThumbnailStates] = useState<Record<number, ThumbnailState>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!inputs.topic.trim()) {
            setError('Vui lòng nhập chủ đề video.'); return;
        }
        setIsLoading(true); setError(null); setResults(null); setThumbnailStates({});
        try {
            const generated = await generateOverallSEO(inputs);
            setResults(generated);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(type);
        setTimeout(() => setCopiedText(null), 2000);
    }

    const handleGenerateThumbnail = async (concept: OverallSEOResult['thumbnails'][0], index: number) => {
        setThumbnailStates(prev => ({ ...prev, [index]: { isLoading: true } }));
        
        const thumbnailPrompt = `
            Create a photorealistic YouTube thumbnail.
            Video Topic: "${inputs.topic}".
            Target Audience: "${inputs.targetAudience}". This is crucial, the people in the image must match this audience.
            Visual Concept: "${concept.conceptDescription}".
            Key Elements: A person matching the target audience with a "${concept.facialExpression}" expression. Include these objects: ${concept.objects.join(', ')}.
            Color Palette: Use a high-contrast scheme with ${concept.colorPairs.join(' and ')}.
            Style: Clean, modern, highly clickable, eye-catching. No text.
        `;

        try {
            const imageUrls = await generateImages(thumbnailPrompt, 1, '16:9');
            if (imageUrls.length > 0) {
                setThumbnailStates(prev => ({ ...prev, [index]: { isLoading: false, imageUrl: imageUrls[0] } }));
            } else {
                 throw new Error("AI không trả về ảnh nào.");
            }
        } catch (e) {
            setError(`Lỗi tạo thumbnail: ${e instanceof Error ? e.message : 'Thử lại sau'}`);
            setThumbnailStates(prev => ({ ...prev, [index]: { isLoading: false } }));
        }
    }

    return (
        <section>
            <div className="text-center mb-12">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <SeoIcon className="w-10 h-10 text-primary" />
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main">SEO Tổng Thể</h2>
                </div>
                <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                    Tạo trọn bộ SEO (Tiêu đề, Mô tả, Tags) và nhận phân tích chi tiết để tối đa hóa hiệu suất video của bạn.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 bg-card border border-secondary rounded-xl p-6 self-start space-y-4">
                    <h3 className="text-xl font-bold text-text-main">Thông tin Video</h3>
                    <div>
                        <label className="font-semibold text-text-main mb-2 block">Chủ đề / Mô tả video</label>
                        <textarea name="topic" value={inputs.topic} onChange={handleInputChange} rows={4} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                    </div>
                    <div>
                        <label className="font-semibold text-text-main mb-2 block">Từ khóa mục tiêu (phân cách bằng dấu phẩy)</label>
                        <input type="text" name="keywords" value={inputs.keywords} onChange={handleInputChange} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                    </div>
                     <div>
                        <label className="font-semibold text-text-main mb-2 block">Đối tượng khán giả</label>
                        <input type="text" name="targetAudience" value={inputs.targetAudience} onChange={handleInputChange} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                    </div>
                     <div>
                        <label className="font-semibold text-text-main mb-2 block">Cảm xúc Thumbnail mong muốn</label>
                        <input type="text" name="desiredEmotion" value={inputs.desiredEmotion} onChange={handleInputChange} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                    </div>
                     <div>
                        <label className="font-semibold text-text-main mb-2 block">Link kênh YouTube của bạn</label>
                        <input type="text" name="channelLink" value={inputs.channelLink} onChange={handleInputChange} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                    </div>
                     <div>
                        <label className="font-semibold text-text-main mb-2 block">Email liên hệ công việc</label>
                        <input type="email" name="businessEmail" value={inputs.businessEmail} onChange={handleInputChange} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2">
                         {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <WandIcon className="w-6 h-6" />}
                         <span>{isLoading ? 'Đang phân tích...' : 'Tạo Gói SEO'}</span>
                     </button>
                </div>

                {/* Results */}
                <div className="lg:col-span-2 space-y-6">
                    {isLoading ? (
                        <div className="bg-card border border-secondary rounded-xl p-6 min-h-[500px] flex flex-col items-center justify-center text-text-secondary">
                            <SpinnerIcon className="w-12 h-12 text-primary animate-spin" />
                            <p className="mt-4">AI đang xây dựng chiến lược SEO cho bạn...</p>
                        </div>
                    ) : error ? (
                         <div className="bg-card border border-secondary rounded-xl p-6 flex flex-col items-center justify-center text-red-400 text-center">
                            <h4 className="font-bold text-lg mb-2">Đã xảy ra lỗi</h4>
                            <p>{error}</p>
                        </div>
                    ) : !results ? (
                        <div className="bg-card border border-secondary rounded-xl p-6 min-h-[500px] flex flex-col items-center justify-center text-text-secondary text-center">
                            <SeoIcon className="w-16 h-16 mb-4"/>
                            <p>Gói SEO hoàn chỉnh sẽ xuất hiện ở đây.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            {/* Titles */}
                            <div className="bg-card border border-secondary rounded-xl p-6">
                                <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><WandIcon className="w-6 h-6 text-accent"/>Lựa chọn Tiêu đề</h3>
                                <div className="space-y-4">
                                    {results.titles.map((title, index) => (
                                        <div key={index} className="bg-background/50 border border-secondary rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-text-main font-semibold pr-4">{title.text}</p>
                                                <button onClick={() => handleCopy(title.text, `title-${index}`)} className="flex-shrink-0">
                                                    {copiedText === `title-${index}` ? <CheckIcon className="w-5 h-5 text-green-500"/> : <ClipboardIcon className="w-5 h-5 text-text-secondary hover:text-white"/>}
                                                </button>
                                            </div>
                                            <div className="w-full bg-secondary rounded-full h-2.5">
                                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${title.score}%` }}></div>
                                            </div>
                                            <div className="text-right text-xs text-text-secondary mt-1">Điểm SEO: <span className="font-bold text-text-main">{title.score}/100</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Thumbnails */}
                            <div className="bg-card border border-secondary rounded-xl p-6">
                                <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><ImageIcon className="w-6 h-6 text-accent"/>Ý tưởng Thumbnail</h3>
                                <div className="space-y-4">
                                    {results.thumbnails.map((concept, index) => {
                                        const state = thumbnailStates[index] || { isLoading: false };
                                        return (
                                            <div key={index} className="bg-background/50 border border-secondary rounded-lg p-4">
                                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <p className="text-text-main font-semibold">{`Concept ${index + 1}`}</p>
                                                             <div className="text-right text-xs text-text-secondary">Điểm Click: <span className="font-bold text-text-main">{concept.score}/100</span></div>
                                                        </div>
                                                        <p className="text-sm text-text-secondary mb-3">{concept.conceptDescription}</p>
                                                        <div className="text-xs space-y-2">
                                                            <p><strong className="text-text-main">Biểu cảm:</strong> {concept.facialExpression}</p>
                                                            <p><strong className="text-text-main">Vật thể:</strong> {concept.objects.join(', ')}</p>
                                                            <p><strong className="text-text-main">Màu sắc:</strong> {concept.colorPairs.join(' | ')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-full md:w-48 h-auto md:h-28 aspect-video md:aspect-auto bg-background border border-secondary rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden relative group">
                                                        {state.isLoading ? (
                                                            <SpinnerIcon className="w-8 h-8 text-primary animate-spin" />
                                                        ) : state.imageUrl ? (
                                                            <>
                                                                <img src={state.imageUrl} alt={`Generated thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                    <a href={state.imageUrl} download={`yt-pro-thumbnail-${index + 1}.jpg`} title="Tải xuống" className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20">
                                                                        <DownloadIcon className="w-5 h-5"/>
                                                                    </a>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <FaceSmileIcon className="w-8 h-8 text-secondary" />
                                                        )}
                                                    </div>
                                                </div>
                                                {!state.imageUrl && (
                                                    <button 
                                                        onClick={() => handleGenerateThumbnail(concept, index)} 
                                                        disabled={state.isLoading}
                                                        className="mt-3 w-full bg-accent/20 text-accent font-semibold py-2 rounded-lg hover:bg-accent/30 transition-colors inline-flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                                    >
                                                        {state.isLoading ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4"/>}
                                                        Tạo ảnh
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                             </div>

                            {/* Description */}
                            <div className="bg-card border border-secondary rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><DocumentTextIcon className="w-6 h-6 text-accent"/>Mô tả Video</h3>
                                    <button onClick={() => handleCopy(results.description, 'desc')} className="text-sm font-semibold text-accent hover:text-orange-400 flex items-center gap-2">
                                        {copiedText === 'desc' ? <><CheckIcon className="w-5 h-5"/> Đã sao chép</> : <><ClipboardIcon className="w-5 h-5"/> Sao chép</>}
                                    </button>
                                </div>
                                <div className="w-full bg-background/50 border border-secondary rounded-lg p-4 text-text-secondary whitespace-pre-wrap font-sans text-sm max-h-60 overflow-y-auto">{results.description}</div>
                            </div>

                             {/* Tags */}
                            <div className="bg-card border border-secondary rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><KeyIcon className="w-6 h-6 text-accent"/>Thẻ Tags</h3>
                                     <button onClick={() => handleCopy(results.tags.tags.join(', '), 'tags')} className="text-sm font-semibold text-accent hover:text-orange-400 flex items-center gap-2">
                                        {copiedText === 'tags' ? <><CheckIcon className="w-5 h-5"/> Đã sao chép</> : <><ClipboardIcon className="w-5 h-5"/> Sao chép tất cả</>}
                                    </button>
                                </div>
                                <div className="bg-background/50 border border-secondary rounded-lg p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {results.tags.tags.map((tag, index) => (
                                            <span key={index} className="bg-secondary text-text-secondary text-sm px-3 py-1 rounded-md">{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-right text-xs text-text-secondary mt-3">Tổng ký tự: {results.tags.characterCount} / 500</p>
                                </div>
                            </div>

                            {/* SEO Scorecard */}
                             <div className="bg-card border border-secondary rounded-xl p-6">
                                <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><ChartIcon className="w-6 h-6 text-accent"/>Bảng điểm SEO</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(results.checklist).map(([key, value]) => (
                                        <div key={key} className="bg-background/50 border border-secondary rounded-lg p-3 flex justify-between items-center">
                                            <span className="text-text-secondary text-sm">{checklistLabels[key] || key}</span>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <div key={i} className={`w-3 h-5 rounded-sm ${i < (value as number) ? 'bg-green-500' : 'bg-secondary'}`}></div>
                                                ))}
                                                 <span className="font-bold text-text-main ml-2">{value}/5</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </section>
    );
};

export default OverallSEO;