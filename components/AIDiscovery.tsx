import React, { useState } from 'react';
import { SearchCodeIcon, SpinnerIcon, TrendingUpIcon, FireIcon, UserPlusIcon, YouTubeIcon } from './IconComponents';

// IMPORTANT: Replace this with the actual URL you get after deploying your Google Cloud Function.
const CLOUD_FUNCTION_URL = 'YOUR_CLOUD_FUNCTION_URL_HERE';

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

const AIDiscovery: React.FC = () => {
    const [query, setQuery] = useState('faceless ai channels');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const handleAnalyzeTrends = async () => {
        if (!query.trim()) {
            setError("Vui lòng nhập một ngách hoặc từ khóa để phân tích.");
            return;
        }

        if (CLOUD_FUNCTION_URL === 'YOUR_CLOUD_FUNCTION_URL_HERE') {
            setError("Lỗi cấu hình: Vui lòng cập nhật URL của Cloud Function trong file 'components/AIDiscovery.tsx' sau khi triển khai.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lỗi từ máy chủ: ${response.status} ${errorText}`);
            }

            const result: AnalysisResult = await response.json();
            setAnalysisResult(result);
        } catch (e) {
            console.error(e);
            const friendlyMessage = e instanceof Error ? e.message : String(e);
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
                        Nhập một ngách để AI phân tích dữ liệu, tìm ra các kênh và video viral có tốc độ tăng trưởng đột phá.
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
                                    onClick={() => { setAnalysisResult(null); setQuery(''); }}
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