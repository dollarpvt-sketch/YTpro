import React, { useState } from 'react';
import { ImageIcon, SpinnerIcon, DownloadIcon, WandIcon, ClipboardDocumentListIcon } from './IconComponents';
import { generateImages, analyzeScriptForPrompts } from '../server/functions';

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    aspectRatio: string;
    style: string;
}

const styles = [
    { name: 'Điện ảnh', value: 'cinematic', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400' },
    { name: 'Nhiếp ảnh', value: 'photorealistic', img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ce87?q=80&w=400' },
    { name: 'Anime', value: 'anime', img: 'https://images.unsplash.com/photo-1607353986868-b138346f1837?q=80&w=400' },
    { name: 'Hoạt hình 3D', value: '3d_animation', img: 'https://images.unsplash.com/photo-1664984364830-4e0a40a598c8?q=80&w=400' },
    { name: 'Tranh sơn dầu', value: 'oil_painting', img: 'https://images.unsplash.com/photo-1547891654-e66ed711b999?q=80&w=400' },
    { name: 'Màu nước', value: 'watercolor', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400' },
    { name: 'Cyberpunk', value: 'cyberpunk', img: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=400' },
    { name: 'Steampunk', value: 'steampunk', img: 'https://images.unsplash.com/photo-1623916993888-95841029eefb?q=80&w=400' },
    { name: 'Ảo mộng', value: 'fantasy_art', img: 'https://images.unsplash.com/photo-1550100136-793a4a75144b?q=80&w=400' },
    { name: 'Concept Art', value: 'concept_art', img: 'https://images.unsplash.com/photo-1587825045005-38965021e1d0?q=80&w=400' },
    { name: 'Isometric', value: 'isometric', img: 'https://images.unsplash.com/photo-1635834169577-767980d944a9?q=80&w=400' },
    { name: 'Pixel Art', value: 'pixel_art', img: 'https://images.unsplash.com/photo-1616788484435-2d42721f582b?q=80&w=400' },
    { name: 'Pop Art', value: 'pop_art', img: 'https://images.unsplash.com/photo-1608555238293-a42e5faf745b?q=80&w=400' },
    { name: 'Cổ điển', value: 'vintage', img: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?q=80&w=400' },
    { name: 'Tối giản', value: 'minimalist', img: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=400' },
    { name: 'Trừu tượng', value: 'abstract', img: 'https://images.unsplash.com/photo-1502691879808-7e113a29547d?q=80&w=400' },
    { name: 'Line Art', value: 'line_art', img: 'https://images.unsplash.com/photo-1605727226306-05ec8a7e0e74?q=80&w=400' },
    { name: 'Gothic', value: 'gothic', img: 'https://images.unsplash.com/photo-15792089-96941541f531?q=80&w=400' },
    { name: 'Vaporwave', value: 'vaporwave', img: 'https://images.unsplash.com/photo-1563272363-f33532729a9a?q=80&w=400' },
    { name: 'Low Poly', value: 'low_poly', img: 'https://images.unsplash.com/photo-1632516643720-e7f5d7d608e4?q=80&w=400' },
];

const TabButton: React.FC<{ name: string; activeTab: string; onClick: () => void }> = ({ name, activeTab, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-semibold text-sm transition-colors duration-300 ${activeTab === name.toLowerCase().split(' ')[0] ? 'border-b-2 border-primary text-text-main' : 'text-text-secondary hover:text-text-main'}`}
  >
    {name}
  </button>
);

const ImageGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
    
    // Single generation states
    const [prompt, setPrompt] = useState('Một phi hành gia đang cưỡi một con kỳ lân trên sao Hỏa');
    const [negativePrompt, setNegativePrompt] = useState('chất lượng thấp, dị dạng, chữ viết');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [selectedStyle, setSelectedStyle] = useState('cinematic');
    const [numberOfImages, setNumberOfImages] = useState(4);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [history, setHistory] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Bulk generation states
    const [bulkScript, setBulkScript] = useState('SCENE 1: Một người phụ nữ trẻ tên là ELARA đang đi bộ qua một khu chợ đêm đầy mưa ở một thành phố cyberpunk. Đèn neon phản chiếu trên vũng nước. Cô ấy trông lo lắng.\n\nSCENE 2: Elara bước vào một cửa hàng mì nhỏ. Một người đàn ông lớn tuổi, JIN, đang lau quầy. Anh ta ngước nhìn cô.\n\nSCENE 3: Cận cảnh một con chip dữ liệu nhỏ mà Elara đang giữ trong tay. Nó phát ra ánh sáng nhẹ.\n\nSCENE 4: Jin gật đầu và chỉ về phía một cánh cửa ở phía sau cửa hàng. Elara di chuyển về phía nó, tỏ vẻ quyết tâm.');
    interface BulkPrompt { id: string; prompt: string; }
    interface BulkImageResult { promptId: string; url: string; }
    const [bulkPrompts, setBulkPrompts] = useState<BulkPrompt[]>([]);
    const [bulkGeneratedImages, setBulkGeneratedImages] = useState<BulkImageResult[]>([]);
    const [isBulkGenerating, setIsBulkGenerating] = useState(false);
    const [bulkError, setBulkError] = useState<string | null>(null);
    const [currentBulkTaskId, setCurrentBulkTaskId] = useState<string | null>(null);

    const handleGenerateImage = async () => {
        if (!prompt.trim()) {
            setError('Vui lòng nhập mô tả cho ảnh.'); return;
        }
        setIsLoading(true); setError(null); setGeneratedImages([]);

        try {
            let fullPrompt = prompt;
            if (selectedStyle !== 'default') fullPrompt += `, phong cách ${selectedStyle.replace(/_/g, ' ')}`;
            if (negativePrompt.trim()) fullPrompt += `. Loại trừ: ${negativePrompt.trim()}`;

            // Call simulated backend function
            // Fix: Pass the selected aspect ratio to the generation function.
            const imageUrls = await generateImages(fullPrompt, numberOfImages, aspectRatio);

            const newImages: GeneratedImage[] = imageUrls.map(url => ({
                id: crypto.randomUUID(),
                url: url,
                prompt: prompt, aspectRatio: aspectRatio, style: selectedStyle
            }));
            setGeneratedImages(newImages);
            setHistory(prev => [...newImages, ...prev].slice(0, 32));
           
        } catch (e) {
            console.error(e);
            setError(`Đã xảy ra lỗi: ${e instanceof Error ? e.message : 'Thử lại sau.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkGenerate = async () => {
        if (!bulkScript.trim()) {
            setBulkError('Vui lòng dán kịch bản vào ô văn bản.'); return;
        }
        setIsBulkGenerating(true); setBulkError(null); setBulkPrompts([]); setBulkGeneratedImages([]);

        try {
            setCurrentBulkTaskId('analyzing');
            // Step 1: Analyze script using backend function
            const parsedPrompts = await analyzeScriptForPrompts(bulkScript);
            if (!parsedPrompts || parsedPrompts.length === 0) {
                throw new Error("AI không thể trích xuất prompt nào từ kịch bản.");
            }
            
            const promptsWithIds = parsedPrompts.map(p => ({ id: crypto.randomUUID(), prompt: p }));
            setBulkPrompts(promptsWithIds);

            // Step 2: Generate images sequentially using backend function
            for (const p of promptsWithIds) {
                setCurrentBulkTaskId(p.id);
                let fullPrompt = `${p.prompt}, phong cách ${selectedStyle.replace(/_/g, ' ')}`;
                const imageUrls = await generateImages(fullPrompt, 1, aspectRatio);

                if (imageUrls.length > 0) {
                    const newImageResult = {
                        promptId: p.id,
                        url: imageUrls[0],
                    };
                    setBulkGeneratedImages(prev => [...prev, newImageResult]);
                    setHistory(prev => [{...newImageResult, id: crypto.randomUUID(), prompt: p.prompt, style: selectedStyle, aspectRatio }, ...prev].slice(0, 32));
                }
            }
        } catch (e) {
            console.error(e);
            setBulkError(`Đã xảy ra lỗi: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setIsBulkGenerating(false);
            setCurrentBulkTaskId(null);
        }
    };
    
    return (
        <section id="yt-pro-vision" className="py-20 bg-background bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent">
            <div className="container mx-auto px-6">
                <div className="text-center mb-6">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <WandIcon className="w-10 h-10 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main">YT Pro Vision</h2>
                    </div>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Studio sáng tạo hình ảnh AI. Biến ý tưởng thành kiệt tác thumbnail, ảnh bìa và hơn thế nữa.
                    </p>
                </div>
                
                <div className="flex justify-center border-b border-secondary mb-8">
                    <TabButton name="Tạo Đơn Lẻ" activeTab={activeTab} onClick={() => setActiveTab('single')} />
                    <TabButton name="Tạo Hàng Loạt" activeTab={activeTab} onClick={() => setActiveTab('bulk')} />
                </div>

                {activeTab === 'single' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-card border border-secondary rounded-xl p-6 self-start flex flex-col gap-6">
                            <div>
                                <label className="block text-text-main mb-2 font-semibold">Số lượng ảnh</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map(n => (
                                        <button key={n} onClick={() => setNumberOfImages(n)} className={`py-2 rounded-lg font-semibold ${numberOfImages === n ? 'bg-primary text-white' : 'bg-background hover:bg-secondary/50'}`} disabled={isLoading}>{n}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="prompt" className="block text-text-main mb-2 font-semibold">Mô tả chính (Prompt)</label>
                                <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                            </div>
                            <div>
                                <label htmlFor="negative-prompt" className="block text-text-secondary mb-2 font-semibold">Prompt Phủ định (Không bao gồm)</label>
                                <textarea id="negative-prompt" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} rows={2} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                            </div>
                            <div>
                                <label htmlFor="style-select" className="block text-text-main mb-2 font-semibold">Phong cách</label>
                                <select 
                                    id="style-select" 
                                    value={selectedStyle} 
                                    onChange={(e) => setSelectedStyle(e.target.value)} 
                                    className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-colors" 
                                    disabled={isLoading}
                                >
                                    {styles.map(style => (
                                        <option key={style.value} value={style.value}>
                                            {style.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="aspect-ratio" className="block text-text-secondary mb-2 font-semibold">Tỷ lệ</label>
                                <select id="aspect-ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading}>
                                    <option value="1:1">Vuông (1:1)</option>
                                    <option value="16:9">Ngang (16:9)</option>
                                    <option value="9:16">Dọc (9:16)</option>
                                    <option value="4:3">4:3</option>
                                    <option value="3:4">3:4</option>
                                </select>
                             </div>
                            <button onClick={handleGenerateImage} disabled={isLoading} className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2">
                                {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <WandIcon className="w-6 h-6" />}
                                <span>{isLoading ? 'Đang tạo...' : `Tạo Ảnh (${numberOfImages})`}</span>
                            </button>
                            {error && <p className="text-red-400 text-center">{error}</p>}
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-card border border-secondary rounded-xl p-6 min-h-[400px]">
                                <h3 className="text-xl font-bold text-text-main mb-4">Kết quả</h3>
                                <div className={`grid gap-4 ${numberOfImages > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    {isLoading ? (
                                        Array.from({ length: numberOfImages }).map((_, i) => (
                                            <div key={i} className="aspect-square bg-background border-2 border-dashed border-secondary rounded-xl flex items-center justify-center">
                                                <SpinnerIcon className="w-10 h-10 text-primary animate-spin" />
                                            </div>
                                        ))
                                    ) : generatedImages.length > 0 ? (
                                        generatedImages.map(image => (
                                            <div key={image.id} className="relative group aspect-square cursor-pointer" onClick={() => setSelectedImage(image.url)}>
                                                <img src={image.url} alt="Generated by AI" className="w-full h-full object-cover rounded-xl"/>
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center gap-2">
                                                    <a 
                                                        href={image.url} 
                                                        download={`yt-pro-vision-${Date.now()}.jpg`} 
                                                        title="Tải xuống" 
                                                        className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <DownloadIcon className="w-5 h-5"/>
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center text-text-secondary py-20">
                                            <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                                            <p>Kết quả của bạn sẽ xuất hiện ở đây.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'bulk' && (
                    <div className="flex flex-col gap-8">
                         <div className="bg-card border border-secondary rounded-xl p-6 self-start flex flex-col gap-6">
                            <div>
                                <label htmlFor="bulk-script" className="block text-text-main mb-2 font-semibold">Dán kịch bản của bạn vào đây</label>
                                <textarea id="bulk-script" value={bulkScript} onChange={(e) => setBulkScript(e.target.value)} rows={8} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isBulkGenerating} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-text-main mb-3 font-semibold">Phong cách chung</label>
                                     <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isBulkGenerating}>
                                        {styles.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-text-main mb-3 font-semibold">Tỷ lệ chung</label>
                                    <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isBulkGenerating}>
                                        <option value="16:9">Ngang (16:9)</option><option value="1:1">Vuông (1:1)</option><option value="9:16">Dọc (9:16)</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleBulkGenerate} disabled={isBulkGenerating} className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2">
                                {isBulkGenerating ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <ClipboardDocumentListIcon className="w-6 h-6" />}
                                <span>{isBulkGenerating ? 'Đang tạo...' : 'Phân Tích & Tạo Hàng Loạt'}</span>
                            </button>
                            {bulkError && <p className="text-red-400 text-center">{bulkError}</p>}
                         </div>

                        {(isBulkGenerating || bulkGeneratedImages.length > 0) && (
                            <div className="bg-card border border-secondary rounded-xl p-6">
                                <h3 className="text-xl font-bold text-text-main mb-4">Kết quả hàng loạt</h3>
                                <div className="space-y-4">
                                    {bulkPrompts.map(p => {
                                        const resultImage = bulkGeneratedImages.find(img => img.promptId === p.id);
                                        const isCurrent = currentBulkTaskId === p.id;
                                        return (
                                            <div key={p.id} className="flex flex-col md:flex-row items-center gap-4 bg-background p-3 rounded-lg border border-secondary">
                                                <div className="w-full md:w-2/3">
                                                    <p className="text-text-secondary text-sm">{p.prompt}</p>
                                                </div>
                                                <div className="w-full md:w-1/3 h-32 md:h-auto md:aspect-video bg-background border-2 border-dashed border-secondary rounded-lg flex items-center justify-center overflow-hidden">
                                                    {resultImage ? <img src={resultImage.url} className="w-full h-full object-cover" /> : isCurrent ? <SpinnerIcon className="w-8 h-8 text-primary animate-spin" /> : <ImageIcon className="w-8 h-8 text-secondary"/>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {currentBulkTaskId === 'analyzing' && (
                                         <div className="flex items-center justify-center gap-3 text-text-secondary py-4">
                                            <SpinnerIcon className="w-6 h-6 animate-spin" />
                                            <span>Đang phân tích kịch bản...</span>
                                         </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {history.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-text-main mb-4">Lịch sử sáng tạo gần đây</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                            {history.map(img => (
                                <img key={img.id} src={img.url} alt={img.prompt} title={img.prompt} className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200" onClick={() => setSelectedImage(img.url)}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image viewer"
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] bg-card p-2 rounded-lg shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <img src={selectedImage} alt="Enlarged view" className="max-w-full max-h-[85vh] object-contain rounded"/>
                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-4 -right-4 bg-primary text-white rounded-full p-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary"
                            aria-label="Close image viewer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

             <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .overflow-x-auto::-webkit-scrollbar { height: 6px; }
                .overflow-x-auto::-webkit-scrollbar-track { background: #282828; border-radius: 3px; }
                .overflow-x-auto::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
                .overflow-x-auto::-webkit-scrollbar-thumb:hover { background: #777; }
            `}</style>
        </section>
    );
};

export default ImageGenerator;