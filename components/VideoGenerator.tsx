import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SpinnerIcon, WandIcon, UploadIcon, DownloadIcon, AlertTriangleIcon, LinkIcon } from './IconComponents';

// A helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
  
const loadingMessages = [
    "AI đang khởi tạo các photon video...",
    "Các pixel đang được sắp xếp một cách nghệ thuật...",
    "Render cảnh quay đầu tiên, vui lòng kiên nhẫn...",
    "Đang đồng bộ hóa âm thanh và hình ảnh lượng tử...",
    "Một kiệt tác cần có thời gian, AI đang làm việc chăm chỉ...",
    "Gần xong rồi, đang thêm những chi tiết cuối cùng...",
];

const models = [
    { id: 'veo-2.0-generate-001', name: 'VEO 2.0 (Ổn định)', enabled: true },
    { id: 'veo-3.0-fast', name: 'VEO 3.0 (Thử nghiệm)', enabled: true },
    { id: 'sora-2.0', name: 'Sora 2.0 (Sắp ra mắt)', enabled: false },
    { id: 'wan-2.5', name: 'WAN 2.5 (Sắp ra mắt)', enabled: false },
];

const styles = [
    { id: 'cinematic', name: 'Điện ảnh (Cinematic)' },
    { id: 'photorealistic', name: 'Chân thực (Photorealistic)' },
    { id: 'hyperrealistic', name: 'Siêu thực (Hyperrealistic)' },
    { id: 'anime', name: 'Hoạt hình Nhật Bản (Anime)' },
    { id: '3d_animation', name: 'Hoạt hình 3D (3D Animation)' },
    { id: 'vintage_film', name: 'Phim cổ điển (Vintage Film)' },
    { id: 'documentary', name: 'Phim tài liệu (Documentary)' },
    { id: 'drone_footage', name: 'Cảnh quay Drone (Drone Footage)' },
    { id: 'fantasy', name: 'Giả tưởng (Fantasy)' },
    { id: 'sci-fi', name: 'Khoa học viễn tưởng (Sci-Fi)' },
    { id: 'horror', name: 'Kinh dị (Horror)' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'watercolor', name: 'Tranh màu nước (Watercolor)' },
    { id: 'stop_motion', name: 'Stop Motion' },
    { id: 'pixel_art', name: 'Nghệ thuật Pixel (Pixel Art)' },
    { id: 'custom', name: 'Khác (Tự nhập)...' },
];


const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('Một con mèo phi hành gia đang trôi nổi trong không gian, đuổi theo một cuộn len vũ trụ phát sáng.');
    const [image, setImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
    const [selectedModel, setSelectedModel] = useState('veo-2.0-generate-001');
    const [selectedStyle, setSelectedStyle] = useState('cinematic');
    const [customStyle, setCustomStyle] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [operation, setOperation] = useState<any | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    
    const messageIntervalRef = useRef<number | null>(null);
    const pollingIntervalRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        };
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setImage({
                    base64,
                    mimeType: file.type,
                    preview: URL.createObjectURL(file)
                });
            } catch (err) {
                setError("Không thể đọc file ảnh.");
            }
        }
    };
    
    const startLoadingMessages = () => {
        let index = 0;
        setLoadingMessage(loadingMessages[index]);
        messageIntervalRef.current = window.setInterval(() => {
            index = (index + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[index]);
        }, 8000);
    };

    const stopLoading = () => {
        setIsLoading(false);
        setOperation(null);
        if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    }
    
    const pollOperation = async (op: any, ai: GoogleGenAI) => {
        try {
            let currentOp = op;
            while (!currentOp.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
                currentOp = await ai.operations.getVideosOperation({ operation: currentOp });
                setOperation(currentOp);
            }

            const downloadLink = currentOp.response?.generatedVideos?.[0]?.video?.uri;
            const apiKey = window.process?.env?.API_KEY;
            if (downloadLink && apiKey) {
                const response = await fetch(`${downloadLink}&key=${apiKey}`);
                const blob = await response.blob();
                setVideoUrl(URL.createObjectURL(blob));
            } else {
                throw new Error("Không tìm thấy link tải video hoặc API key.");
            }
            stopLoading();

        } catch (e) {
             console.error(e);
             setError(`Lỗi khi kiểm tra tiến trình: ${e instanceof Error ? e.message : 'Lỗi không xác định'}`);
             stopLoading();
        }
    };

    const handleGenerateVideo = async () => {
        if (!prompt.trim()) {
            setError('Vui lòng nhập mô tả cho video.'); return;
        }
        if (selectedStyle === 'custom' && !customStyle.trim()) {
            setError('Vui lòng nhập phong cách tùy chỉnh.'); return;
        }

        const apiKey = window.process?.env?.API_KEY;
        if (!apiKey) {
            setError('API Key chưa được cấu hình.'); return;
        }
        
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setOperation(null);
        startLoadingMessages();

        try {
            const ai = new GoogleGenAI({ apiKey });
            
            let styleText = '';
            if (selectedStyle === 'custom') {
                styleText = customStyle.trim();
            } else {
                const styleInfo = styles.find(s => s.id === selectedStyle);
                styleText = styleInfo ? styleInfo.name.toLowerCase() : 'cinematic';
            }
            const finalPrompt = `${prompt}${styleText ? `, phong cách ${styleText}` : ''}.`;
            
            let initialOperation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001', // Use the stable model for actual API call
                prompt: finalPrompt,
                ...(image && { image: { imageBytes: image.base64, mimeType: image.mimeType } }),
                config: { numberOfVideos: 1 }
            });
            setOperation(initialOperation);
            pollOperation(initialOperation, ai);
            
        } catch (e) {
            console.error(e);
            setError(`Đã xảy ra lỗi khi bắt đầu tạo video: ${e instanceof Error ? e.message : 'Vui lòng kiểm tra API key và thử lại.'}`);
            stopLoading();
        }
    };

    return (
        <>
            <section id="video-generator">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main">Tạo Video AI (YT Pro Motion)</h2>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Biến ý tưởng của bạn thành video chuyển động. Nhập mô tả, tải lên ảnh (tùy chọn) và để AI thực hiện điều kỳ diệu.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-secondary rounded-xl p-6 flex flex-col gap-6 self-start">
                        <div>
                            <label htmlFor="prompt-video" className="block text-text-main mb-2 font-semibold">1. Mô tả video (Prompt)</label>
                            <textarea id="prompt-video" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                        </div>
                        <div>
                            <label className="block text-text-main mb-2 font-semibold">2. Ảnh đầu vào (Tùy chọn)</label>
                            <div 
                                onClick={() => !isLoading && fileInputRef.current?.click()}
                                className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-center p-4 transition-colors
                                    ${isLoading ? 'cursor-not-allowed bg-background/50 border-secondary' : 'cursor-pointer bg-background border-secondary hover:border-primary hover:bg-primary/10'}`}
                            >
                                <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="hidden" disabled={isLoading}/>
                                {image ? (
                                    <img src={image.preview} alt="Preview" className="max-h-full max-w-full object-contain rounded"/>
                                ) : (
                                    <div className="text-text-secondary">
                                        <UploadIcon className="w-8 h-8 mx-auto mb-2"/>
                                        <p>Nhấp hoặc kéo thả ảnh vào đây</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="model-select" className="block text-text-main mb-2 font-semibold">3. Model</label>
                            <select id="model-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={isLoading} className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary">
                                {models.map(model => (
                                    <option key={model.id} value={model.id} disabled={!model.enabled}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="style-select" className="block text-text-main mb-2 font-semibold">4. Phong cách</label>
                            <select 
                                id="style-select" 
                                value={selectedStyle} 
                                onChange={(e) => setSelectedStyle(e.target.value)} 
                                disabled={isLoading} 
                                className="w-full bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {styles.map(style => (
                                    <option key={style.id} value={style.id}>
                                        {style.name}
                                    </option>
                                ))}
                            </select>
                            {selectedStyle === 'custom' && (
                                <input
                                    type="text"
                                    value={customStyle}
                                    onChange={(e) => setCustomStyle(e.target.value)}
                                    placeholder="Nhập phong cách của bạn..."
                                    disabled={isLoading}
                                    className="w-full mt-2 bg-background border border-secondary rounded-lg p-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            )}
                        </div>


                        <button onClick={handleGenerateVideo} disabled={isLoading} className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2">
                            {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <WandIcon className="w-6 h-6" />}
                            <span>{isLoading ? 'Đang tạo...' : 'Tạo Video'}</span>
                        </button>
                        {error && <p className="text-red-400 text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}
                        
                        <div className="text-center pt-4 border-t border-secondary/50">
                            <a href="https://runwayml.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Bạn cũng có thể thử các nền tảng khác như RunwayML
                            </a>
                        </div>
                    </div>

                    <div className="bg-card border border-secondary rounded-xl p-6 flex items-center justify-center min-h-[300px] lg:min-h-full">
                        {isLoading ? (
                            <div className="text-center text-text-secondary">
                                <SpinnerIcon className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                                <p className="font-semibold text-lg text-text-main mb-2">{loadingMessage}</p>
                                <p className="text-sm">Quá trình tạo video có thể mất vài phút. Cảm ơn sự kiên nhẫn của bạn!</p>
                            </div>
                        ) : videoUrl ? (
                            <div className="w-full aspect-video relative group">
                                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain rounded-lg bg-black"/>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                    <a href={videoUrl} download={`yt-pro-motion-${Date.now()}.mp4`} title="Tải xuống" className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20">
                                        <DownloadIcon className="w-6 h-6"/>
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-text-secondary">
                                <WandIcon className="w-12 h-12 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-text-main mb-2">Xem trước Video</h3>
                                <p>Kết quả video của bạn sẽ xuất hiện ở đây sau khi tạo.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default VideoGenerator;