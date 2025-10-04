import React from 'react';
import { SeoIcon, UserPlusIcon, SearchCodeIcon, CheckIcon, ChartIcon, WandIcon } from './IconComponents';

const subTools = [
    {
        icon: <SeoIcon className="w-8 h-8 text-accent"/>,
        title: "Nghiên cứu từ khóa",
        description: "Tìm kiếm các từ khóa vàng có lượng tìm kiếm cao và mức độ cạnh tranh thấp."
    },
    {
        icon: <UserPlusIcon className="w-8 h-8 text-accent"/>,
        title: "Phân tích đối thủ",
        description: "Xem chi tiết chiến lược, từ khóa và video thành công nhất của đối thủ."
    },
    {
        icon: <SearchCodeIcon className="w-8 h-8 text-accent"/>,
        title: "Tìm ngách nhỏ (Mini Niches)",
        description: "Khám phá các thị trường ngách ít cạnh tranh nhưng có tiềm năng phát triển lớn."
    },
    {
        icon: <CheckIcon className="w-8 h-8 text-accent"/>,
        title: "Kiểm tra A/B Thumbnail",
        description: "So sánh hiệu quả của hai thumbnail khác nhau để chọn ra cái tốt nhất."
    },
    {
        icon: <ChartIcon className="w-8 h-8 text-accent"/>,
        title: "Phân tích kênh",
        description: "Nhận một báo cáo toàn diện về điểm mạnh, điểm yếu và cơ hội phát triển kênh."
    }
];

const YouTubeTricks: React.FC = () => {
    return (
        <section id="youtube-tricks" className="py-20 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <WandIcon className="w-10 h-10 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main">Tut, Trick YouTube</h2>
                    </div>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Bộ công cụ chuyên sâu giúp bạn thống trị thuật toán. Từ nghiên cứu đến phân tích, tất cả những gì bạn cần để vượt lên đối thủ.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subTools.map(tool => (
                        <div key={tool.title} className="bg-card border border-secondary rounded-xl p-6 flex flex-col">
                             <div className="flex items-center gap-4 mb-4">
                                {tool.icon}
                                <h3 className="text-xl font-bold text-text-main">{tool.title}</h3>
                             </div>
                             <p className="text-text-secondary flex-grow mb-6">{tool.description}</p>
                             <button disabled className="w-full mt-auto bg-secondary text-text-secondary font-semibold py-2 px-4 rounded-lg cursor-not-allowed relative group">
                                Truy cập
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Tính năng đang được phát triển
                                </span>
                             </button>
                        </div>
                    ))}
                     <div className="bg-primary/10 border border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center text-center lg:col-span-3">
                        <h3 className="text-2xl font-bold text-primary">Và còn nhiều hơn nữa!</h3>
                        <p className="text-text-secondary mt-2">Chúng tôi liên tục phát triển và bổ sung các công cụ mới dựa trên phản hồi của cộng đồng.</p>
                     </div>
                </div>
            </div>
        </section>
    );
};

export default YouTubeTricks;
