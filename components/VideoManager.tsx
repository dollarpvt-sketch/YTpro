import React from 'react';
import { LayoutGridIcon } from './IconComponents';

const mockVideos = [
    {
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        title: 'Top 5 AI Tools That Will Change The World',
        views: '1.2M',
        likes: '98K',
        comments: '4.5K',
        status: 'Published',
        date: '25/07/2024'
    },
    {
        thumbnail: 'https://i.ytimg.com/vi/3tmd-ClpJxA/hqdefault.jpg',
        title: 'How to Grow a YouTube Channel from 0 to 100k Subs',
        views: '875K',
        likes: '72K',
        comments: '3.1K',
        status: 'Published',
        date: '18/07/2024'
    },
    {
        thumbnail: 'https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg',
        title: 'The Future of Faceless YouTube Automation',
        views: 'N/A',
        likes: 'N/A',
        comments: 'N/A',
        status: 'Scheduled',
        date: '02/08/2024'
    },
     {
        thumbnail: 'https://i.ytimg.com/vi/C0DPdy98e4c/hqdefault.jpg',
        title: 'Unboxing The New "AI-Powered" Camera',
        views: 'N/A',
        likes: 'N/A',
        comments: 'N/A',
        status: 'Draft',
        date: 'N/A'
    }
];

const VideoManager: React.FC = () => {
    return (
        <section id="video-manager" className="py-20 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main">Trình Quản Lý Video</h2>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Tất cả video của bạn, được sắp xếp và quản lý một cách thông minh. Lên lịch, xem phân tích và tối ưu hóa hiệu suất tại một nơi duy nhất.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-card border border-secondary rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-bold text-text-main">Video của bạn</h3>
                         <button className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                            Tải lên Video Mới
                         </button>
                    </div>
                    <div className="bg-background rounded-lg border border-secondary overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-text-main">Video</th>
                                    <th className="p-4 text-sm font-semibold text-text-main hidden lg:table-cell">Lượt xem</th>
                                    <th className="p-4 text-sm font-semibold text-text-main hidden md:table-cell">Trạng thái</th>
                                    <th className="p-4 text-sm font-semibold text-text-main hidden sm:table-cell">Ngày</th>
                                    <th className="p-4 text-sm font-semibold text-text-main">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary">
                                {mockVideos.map(video => (
                                    <tr key={video.title}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <img src={video.thumbnail} alt={video.title} className="w-24 h-14 object-cover rounded-md hidden sm:block"/>
                                                <span className="font-semibold text-text-main">{video.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-text-secondary hidden lg:table-cell">{video.views}</td>
                                        <td className="p-4 hidden md:table-cell">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                video.status === 'Published' ? 'bg-green-500/10 text-green-400' :
                                                video.status === 'Scheduled' ? 'bg-sky-500/10 text-sky-400' :
                                                'bg-amber-500/10 text-amber-400'
                                            }`}>{video.status}</span>
                                        </td>
                                        <td className="p-4 text-text-secondary hidden sm:table-cell">{video.date}</td>
                                        <td className="p-4">
                                            <button className="text-primary hover:underline">Chi tiết</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-text-secondary mt-4 italic text-center">*Giao diện mô phỏng. Chức năng đầy đủ sẽ được tích hợp khi kết nối với API YouTube.</p>
                </div>
            </div>
        </section>
    );
};

export default VideoManager;
