import React from 'react';
import { LayersIcon } from './IconComponents';

const mockVideosForBulk = [
    { id: 1, thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', title: 'Top 5 AI Tools That Will Change The World' },
    { id: 2, thumbnail: 'https://i.ytimg.com/vi/3tmd-ClpJxA/hqdefault.jpg', title: 'How to Grow a YouTube Channel from 0 to 100k Subs' },
    { id: 3, thumbnail: 'https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg', title: 'The Future of Faceless YouTube Automation' },
    { id: 4, thumbnail: 'https://i.ytimg.com/vi/C0DPdy98e4c/hqdefault.jpg', title: 'Unboxing The New "AI-Powered" Camera' },
];

const BulkEditor: React.FC = () => {
    return (
        <section id="bulk-editor" className="py-20 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main">Chỉnh Sửa Hàng Loạt</h2>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Thay đổi tiêu đề, mô tả, thẻ tags cho hàng trăm video chỉ trong vài cú nhấp chuột. Tiết kiệm thời gian, tối ưu hóa hiệu quả.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-card border border-secondary rounded-xl p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <h3 className="text-xl font-bold text-text-main mb-4">1. Chọn video cần chỉnh sửa</h3>
                             <div className="bg-background border border-secondary rounded-lg h-96 overflow-y-auto">
                                <div className="divide-y divide-secondary">
                                    {mockVideosForBulk.map(video => (
                                        <div key={video.id} className="p-3 flex items-center gap-4 hover:bg-secondary/30">
                                            <input type="checkbox" className="h-5 w-5 rounded bg-background border-secondary text-primary focus:ring-primary"/>
                                            <img src={video.thumbnail} alt={video.title} className="w-20 h-11 object-cover rounded"/>
                                            <p className="text-text-secondary">{video.title}</p>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                        <div>
                             <h3 className="text-xl font-bold text-text-main mb-4">2. Áp dụng thay đổi</h3>
                             <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-text-secondary">Thêm vào đầu tiêu đề</label>
                                    <input type="text" placeholder="[HOT] " className="w-full mt-1 bg-background border border-secondary rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary"/>
                                </div>
                                 <div>
                                    <label className="text-sm font-medium text-text-secondary">Thêm vào cuối mô tả</label>
                                    <textarea placeholder="Theo dõi tôi tại..." rows={4} className="w-full mt-1 bg-background border border-secondary rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary"></textarea>
                                </div>
                                 <div>
                                    <label className="text-sm font-medium text-text-secondary">Tìm & Thay thế trong Tags</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Tìm" className="w-1/2 mt-1 bg-background border border-secondary rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary"/>
                                        <input type="text" placeholder="Thay thế" className="w-1/2 mt-1 bg-background border border-secondary rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary"/>
                                    </div>
                                </div>
                                 <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                                    Áp Dụng Cho 4 Video
                                 </button>
                             </div>
                        </div>
                    </div>
                     <p className="text-xs text-text-secondary mt-6 italic text-center">*Giao diện mô phỏng. Chức năng đầy đủ sẽ được tích hợp khi kết nối với API YouTube.</p>
                </div>
            </div>
        </section>
    );
};

export default BulkEditor;
