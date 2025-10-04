import React from 'react';
import { 
    WandIcon, 
    RefreshIcon, 
    SpeakerWaveIcon, 
    ImageIcon, 
    PlayIcon as VideoIcon, 
    SearchCodeIcon, 
    LayoutGridIcon, 
    LayersIcon, 
    BoltIcon,
    YouTubeIcon
} from './IconComponents';

interface ToolsShowcaseProps {
  onSelectTool: (toolId: string) => void;
}

const toolGroups = [
    {
        name: 'Sáng tạo Nội dung',
        color: 'sky-500',
        tools: [
            {
                id: 'script-writer',
                icon: <WandIcon className="w-8 h-8 text-sky-500" />,
                title: 'Trợ lý Viết Kịch Bản AI',
                description: 'Tạo kịch bản video chuyên nghiệp từ một chủ đề đơn giản.'
            },
            {
                id: 'script-rewriter',
                icon: <RefreshIcon className="w-8 h-8 text-sky-500" />,
                title: 'Viết Lại & Cải Tiến Kịch Bản',
                description: 'Biến kịch bản có sẵn thành một tác phẩm có khả năng viral.'
            },
            {
                id: 'text-to-speech',
                icon: <SpeakerWaveIcon className="w-8 h-8 text-sky-500" />,
                title: 'Chuyển Văn Bản thành Giọng Nói',
                description: 'Tạo giọng đọc AI chất lượng cao cho video của bạn.'
            },
        ]
    },
    {
        name: 'Sản xuất Media',
        color: 'rose-500',
        tools: [
            {
                id: 'image-generator',
                icon: <ImageIcon className="w-8 h-8 text-rose-500" />,
                title: 'Tạo Ảnh AI (YT Pro Vision)',
                description: 'Biến ý tưởng thành hình ảnh độc đáo cho thumbnail và nội dung.'
            },
            {
                id: 'video-generator',
                icon: <VideoIcon className="w-8 h-8 text-rose-500" />,
                title: 'Tạo Video AI (YT Pro Motion)',
                description: 'Tạo video ngắn từ mô tả văn bản hoặc hình ảnh.'
            },
        ]
    },
    {
        name: 'Tăng trưởng & SEO',
        color: 'emerald-500',
        tools: [
             {
                id: 'youtube-tricks',
                icon: <YouTubeIcon className="w-8 h-8 text-emerald-500" />,
                title: 'Tut, Trick YouTube',
                description: 'Bộ công cụ chuyên sâu giúp bạn thống trị thuật toán YouTube.'
            },
            {
                id: 'channel-discovery',
                icon: <SearchCodeIcon className="w-8 h-8 text-emerald-500" />,
                title: 'Tìm Kênh Ẩn, Ngách Ẩn',
                description: 'Phân tích dữ liệu, tìm ra các kênh và video có tốc độ tăng trưởng đột phá.'
            },
        ]
    },
    {
        name: 'Quản lý & Tự động hóa',
        color: 'amber-500',
        tools: [
            {
                id: 'video-manager',
                icon: <LayoutGridIcon className="w-8 h-8 text-amber-500" />,
                title: 'Trình Quản Lý Video',
                description: 'Quản lý, lên lịch và xem phân tích video tại một nơi duy nhất.'
            },
            {
                id: 'bulk-editor',
                icon: <LayersIcon className="w-8 h-8 text-amber-500" />,
                title: 'Chỉnh Sửa Hàng Loạt',
                description: 'Thay đổi tiêu đề, mô tả, tags cho hàng trăm video cùng lúc.'
            },
            {
                id: 'automation',
                icon: <BoltIcon className="w-8 h-8 text-amber-500" />,
                title: 'AI Automation',
                description: 'Tự động hóa quy trình đăng tải nội dung lên các mạng xã hội khác.'
            },
        ]
    }
];

const ToolCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onSelect: () => void;
}> = ({ icon, title, description, onSelect }) => (
    <div 
        onClick={onSelect}
        className="bg-card rounded-xl border border-secondary p-6 flex flex-col items-start h-full cursor-pointer group hover:border-primary hover:-translate-y-1 transition-all duration-300"
    >
        <div className="bg-background p-3 rounded-lg border border-secondary mb-4 group-hover:bg-primary/10 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
        <p className="text-text-secondary text-sm flex-grow">{description}</p>
    </div>
);


const ToolsShowcase: React.FC<ToolsShowcaseProps> = ({ onSelectTool }) => {
  return (
    <section id="tools" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main">Bảng Điều Khiển Công Cụ</h2>
          <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
            Chọn một công cụ từ các danh mục được sắp xếp theo quy trình làm việc của bạn.
          </p>
        </div>
        <div className="space-y-16">
            {toolGroups.map((group) => (
                <div key={group.name}>
                    <h3 className={`text-2xl font-bold text-text-main mb-6 border-l-4 pl-4 border-${group.color}`}>
                        {group.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {group.tools.map((tool) => (
                            <ToolCard 
                                key={tool.id}
                                {...tool}
                                onSelect={() => onSelectTool(tool.id)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
