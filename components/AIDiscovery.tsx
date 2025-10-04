import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SearchCodeIcon, SpinnerIcon, TrendingUpIcon, FireIcon, UserPlusIcon, YouTubeIcon } from './IconComponents';

interface Channel {
    name: string;
    subscriberCount: string;
    subscriberGrowth: {
        last7Days: string;
        last30Days: string;
    };
    avgViews: string;
    niche: string;
}

interface Video {
    title: string;
    channelName: string;
    views: string;
    vph: string;
    viralIndex: number;
    uploadDate: string;
}

interface AnalysisResult {
    trendingChannels: Channel[];
    viralVideos: Video[];
}

// Helper to format large numbers
const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

const AIDiscovery: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const fetchWithEnhancedErrorHandling = async (url: string, apiName: string): Promise<any> => {
        const response = await fetch(url);
        if (!response.ok) {
            let errorDetails = `Status: ${response.status} ${response.statusText}.`;
            try {
                const errorData = await response.json();
                if (errorData.error?.message) {
                    errorDetails += ` Chi tiết: ${errorData.error.message}`;
                }
            } catch (jsonError) {
                // Ignore if response is not json, the status text is enough
            }

            if (response.status === 400 || response.status === 403) {
                errorDetails += " Vui lòng kiểm tra lại API key và chắc chắn rằng bạn đã bật 'YouTube Data API v3' và cấu hình giới hạn HTTP referrer chính xác trong Google Cloud Console.";
            }
            
            throw new Error(`Lỗi API YouTube (${apiName}). ${errorDetails}`);
        }
        return response.json();
    };

    const handleAnalyzeTrends = async () => {
        if (!query.trim()) {
            setError("Vui lòng nhập một ngách hoặc từ khóa để phân tích.");
            return;
        }
        
        const apiKey = window.process?.env?.API_KEY;
        if (!apiKey || apiKey.startsWith('AIzaSy') === false) { // Basic check for valid key format
            setError('API Key không hợp lệ hoặc chưa được cấu hình trong file env.js.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            // Step 1: Fetch real data from YouTube API
            const searchData = await fetchWithEnhancedErrorHandling(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(query)}&type=video&order=relevance&key=${apiKey}`,
                'Search'
            );
            
            if (!searchData.items || searchData.items.length === 0) {
                 throw new Error("Không tìm thấy video nào cho từ khóa này. Hãy thử một từ khóa khác.");
            }

            const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
            const channelIds = [...new Set(searchData.items.map((item: any) => item.snippet.channelId))].join(',');

            const [videosData, channelsData] = await Promise.all([
                fetchWithEnhancedErrorHandling(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`, 'Videos'),
                fetchWithEnhancedErrorHandling(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${apiKey}`, 'Channels')
            ]);
            
            const processedYoutubeData = {
                videos: videosData.items.map((v: any) => ({
                    id: v.id,
                    title: v.snippet.title,
                    publishedAt: v.snippet.publishedAt,
                    viewCount: v.statistics.viewCount,
                    channelId: v.snippet.channelId,
                    channelTitle: v.snippet.channelTitle,
                })),
                channels: channelsData.items.map((c: any) => ({
                    id: c.id,
                    title: c.snippet.title,
                    subscriberCount: c.statistics.subscriberCount,
                }))
            };

            // Step 2: Send data to Gemini for analysis
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Bạn là Vidx.ai, một công cụ phân tích YouTube chuyên sâu. Dựa trên dữ liệu thô từ API YouTube sau đây, hãy phân tích để tìm ra các kênh "faceless AI" đang thịnh hành và các video viral. Các chỉ số phải hợp lý, VPH (lượt xem mỗi giờ) cần được tính dựa trên lượt xem và ngày đăng. Trả về một đối tượng JSON tuân thủ schema đã cho.
            
            Dữ liệu YouTube: ${JSON.stringify(processedYoutubeData)}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            trendingChannels: {
                                type: Type.ARRAY,
                                description: "Danh sách 3-5 kênh faceless AI đang thịnh hành nhất từ dữ liệu.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING, description: "Tên kênh." },
                                        subscriberCount: { type: Type.STRING, description: "Tổng số người đăng ký, định dạng '123K' hoặc '1.2M'." },
                                        subscriberGrowth: {
                                            type: Type.OBJECT,
                                            properties: {
                                                last7Days: { type: Type.STRING, description: "Ước tính người đăng ký mới trong 7 ngày, ví dụ '+5.2K'." },
                                                last30Days: { type: Type.STRING, description: "Ước tính người đăng ký mới trong 30 ngày, ví dụ '+25K'." },
                                            },
                                            required: ['last7Days', 'last30Days']
                                        },
                                        avgViews: { type: Type.STRING, description: "Lượt xem trung bình mỗi video, ví dụ '150K'." },
                                        niche: { type: Type.STRING, description: "Thị trường ngách của kênh." }
                                    },
                                    required: ['name', 'subscriberCount', 'subscriberGrowth', 'avgViews', 'niche']
                                }
                            },
                            viralVideos: {
                                type: Type.ARRAY,
                                description: "Danh sách 5-10 video viral nhất từ dữ liệu.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING, description: "Tiêu đề video." },
                                        channelName: { type: Type.STRING, description: "Tên kênh đã đăng video." },
                                        views: { type: Type.STRING, description: "Tổng lượt xem, ví dụ '1.8M'." },
                                        vph: { type: Type.STRING, description: "Lượt xem mỗi giờ (VPH) được tính toán, ví dụ '2.5K'." },
                                        viralIndex: { type: Type.INTEGER, description: "Chỉ số lan truyền từ 1-100, dựa trên VPH và tương quan với kênh." },
                                        uploadDate: { type: Type.STRING, description: "Ngày đăng video, ví dụ '5 ngày trước'." }
                                    },
                                    required: ['title', 'channelName', 'views', 'vph', 'viralIndex', 'uploadDate']
                                }
                            }
                        },
                        required: ['trendingChannels', 'viralVideos']
                    },
                }
            });
            
            if (response.text) {
                const result = JSON.parse(response.text);
                setAnalysisResult(result);
            } else {
                 setError('AI không thể phân tích dữ liệu. Vui lòng thử lại.');
            }
        } catch (e) {
            console.error(e);
            let friendlyMessage = e instanceof Error ? e.message : String(e);
            if (friendlyMessage.includes('Failed to fetch')) {
                 friendlyMessage = "Lỗi mạng hoặc CORS. Vui lòng kiểm tra kết nối internet và đảm bảo API key của bạn cho phép truy cập từ tên miền này trong Google Cloud Console.";
            }
            setError(`Đã xảy ra lỗi: ${friendlyMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="channel-discovery" className="py-20 bg-background bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main">Tìm Kênh Ẩn, Ngách Ẩn (Theo Vidx.ai)</h2>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Kết nối sức mạnh của API YouTube và Gemini. Nhập một ngách để phân tích dữ liệu thực tế, tìm ra các kênh và video viral có tốc độ tăng trưởng đột phá.
                    </p>
                </div>
                
                <div className="max-w-5xl mx-auto">
                    {!analysisResult && (
                        <div className="bg-card border border-secondary rounded-xl p-8">
                             <div className="flex flex-col md:flex-row gap-4 items-center">
                                 <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Nhập ngách bạn muốn phân tích (ví dụ: 'AI storytelling')"
                                    className="w-full bg-background border border-secondary rounded-lg px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-lg"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleAnalyzeTrends}
                                    disabled={isLoading}
                                    className="w-full md:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2 flex-shrink-0"
                                >
                                    {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <SearchCodeIcon className="w-6 h-6" />}
                                    <span>{isLoading ? 'Đang phân tích...' : 'Phân Tích'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-400 mt-6 text-center bg-red-500/10 border border-red-500/30 rounded-lg p-4 leading-relaxed">{error}</p>}
                    
                    {analysisResult && (
                        <div className="space-y-12 animate-fade-in">
                            <div>
                                <h3 className="text-2xl font-bold text-primary mb-6">Phân Tích Ngách: "{query}"</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {analysisResult.trendingChannels.map((channel, index) => (
                                        <div key={index} className="bg-card border border-secondary rounded-xl p-6 flex flex-col space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <YouTubeIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
                                                <h4 className="text-lg font-bold text-text-main truncate">{channel.name}</h4>
                                            </div>
                                            <div className="text-sm bg-background/50 border border-secondary/50 rounded-full px-3 py-1 self-start">{channel.niche}</div>
                                            <div className="flex items-center space-x-2 text-text-secondary"><UserPlusIcon className="w-5 h-5 text-sky-400" /><span>{channel.subscriberCount} Subscribers</span></div>
                                            <div className="flex items-center space-x-2 text-text-secondary"><TrendingUpIcon className="w-5 h-5 text-green-400" /><span>{channel.subscriberGrowth.last30Days} (30d)</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                               <h3 className="text-2xl font-bold text-primary mb-6">Các Video Viral Gần Đây</h3>
                               <div className="bg-card border border-secondary rounded-xl overflow-hidden">
                                   <div className="divide-y divide-secondary">
                                       {analysisResult.viralVideos.map((video, index) => (
                                           <div key={index} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
                                               <div className="lg:col-span-2">
                                                   <p className="font-semibold text-text-main">{video.title}</p>
                                                   <p className="text-sm text-text-secondary">{video.channelName}</p>
                                               </div>
                                                <div className="flex items-center space-x-2"><YouTubeIcon className="w-5 h-5 text-text-secondary" /> <span className="text-text-main font-medium">{video.views} Views</span></div>
                                                <div className="flex items-center space-x-2"><TrendingUpIcon className="w-5 h-5 text-green-400" /><span className="text-text-main font-medium">{video.vph}/hr</span></div>
                                                <div className="flex items-center space-x-2"><FireIcon className="w-5 h-5 text-amber-400" /><span className="text-text-main font-medium">Viral: {video.viralIndex}/100</span></div>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                            </div>

                             <div className="text-center pt-8">
                                <button
                                    onClick={() => setAnalysisResult(null)}
                                    className="bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                >
                                    <span>Phân Tích Ngách Khác</span>
                                </button>
                             </div>
                        </div>
                    )}
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
            </div>
        </section>
    );
};

export default AIDiscovery;
