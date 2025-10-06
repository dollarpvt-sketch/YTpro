import React, { useState } from 'react';
import { 
    YouTubeIcon,
    LayersIcon,
    LightBulbIcon,
    KeyIcon,
    ChatBubbleLeftRightIcon,
    CalendarIcon,
    MouseClickIcon,
    ArrowLeftIcon,
    SeoIcon,
} from './IconComponents';
import OverallSEO from './AITitleGenerator';

const trickTools = [
    {
        id: 'overall-seo',
        icon: <SeoIcon className="w-8 h-8 text-emerald-500" />,
        title: 'SEO Tổng Thể',
        description: 'Tạo trọn bộ SEO cho video: Tiêu đề, mô tả, tags và bảng điểm phân tích chi tiết.',
        isAvailable: true,
    },
    {
        id: 'thumbnail-tester',
        icon: <LayersIcon className="w-8 h-8 text-emerald-500" />,
        title: 'Thumbnail A/B Tester',
        description: 'So sánh hiệu suất 2 thumbnail khác nhau để tìm ra cái có CTR cao nhất.',
        isAvailable: false,
    },
    {
        id: 'tag-extractor',
        icon: <KeyIcon className="w-8 h-8 text-emerald-500" />,
        title: 'Tag Extractor',
        description: 'Trích xuất các thẻ tag mà đối thủ cạnh tranh của bạn đang sử dụng để xếp hạng cao.',
        isAvailable: false,
    },
    {
        id: 'comment-analyzer',
        icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-emerald-500" />,
        title: 'Comment Analyzer',
        description: 'Phân tích bình luận để tìm ra ý tưởng nội dung mới và hiểu rõ hơn về khán giả.',
        isAvailable: false,
    },
    {
        id: 'best-time-to-post',
        icon: <CalendarIcon className="w-8 h-8 text-emerald-500" />,
        title: 'Best Time to Post',
        description: 'Phân tích dữ liệu kênh của bạn để đề xuất thời gian đăng video tối ưu nhất.',
        isAvailable: false,
    },
    {
        id: 'ctr-predictor',
        icon: <MouseClickIcon className="w-8 h-8 text-emerald-500" />,
        title: 'CTR Predictor',
        description: 'Dự đoán tỷ lệ nhấp chuột (CTR) tiềm năng cho tiêu đề và thumbnail của bạn.',
        isAvailable: false,
    },
];

interface TrickToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isAvailable: boolean;
    onClick: () => void;
}

const TrickToolCard: React.FC<TrickToolCardProps> = ({ icon, title, description, isAvailable, onClick }) => (
    <div 
        onClick={isAvailable ? onClick : undefined}
        className={`relative bg-card rounded-xl border border-secondary p-6 flex flex-col items-start h-full group transition-all duration-300
            ${isAvailable 
                ? 'cursor-pointer hover:border-primary hover:-translate-y-1' 
                : 'cursor-not-allowed opacity-60'
            }`}
    >
        {!isAvailable && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                SẮP RA MẮT
            </div>
        )}
        <div className="bg-background p-3 rounded-lg border border-secondary mb-4 group-hover:bg-primary/10 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
        <p className="text-text-secondary text-sm flex-grow">{description}</p>
    </div>
);


const YouTubeTricks: React.FC = () => {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const renderTool = () => {
        switch(activeTool) {
            case 'overall-seo':
                return <OverallSEO />;
            // Add cases for other tools here in the future
            default:
                return null;
        }
    };
    
    if (activeTool) {
        return (
            <div className="animate-fade-in">
                 <button 
                    onClick={() => setActiveTool(null)} 
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-text-main mb-8 transition-colors group"
                >
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span>Quay lại Tut & Trick</span>
                </button>
                {renderTool()}
            </div>
        );
    }


    return (
        <section id="youtube-tricks" className="py-20 bg-background bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <div className="flex justify-center items-center gap-4 mb-4">
                        <YouTubeIcon className="w-10 h-10 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main">Tut, Trick YouTube</h2>
                    </div>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Bộ sưu tập các công cụ chuyên sâu giúp bạn tinh chỉnh mọi khía cạnh của video và thống trị thuật toán YouTube.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {trickTools.map((tool) => (
                        <TrickToolCard 
                            key={tool.id}
                            icon={tool.icon}
                            title={tool.title}
                            description={tool.description}
                            isAvailable={tool.isAvailable}
                            onClick={() => setActiveTool(tool.id)}
                        />
                    ))}
                </div>
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
            `}</style>
        </section>
    );
};

export default YouTubeTricks;