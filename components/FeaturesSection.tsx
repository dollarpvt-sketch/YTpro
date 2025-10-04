import React from 'react';
import { SeoIcon, AiIcon, DragDropIcon } from './IconComponents';

const features = [
  {
    icon: <SeoIcon className="w-8 h-8 text-primary" />,
    title: 'Tối ưu SEO YouTube',
    description: 'Phân tích từ khóa, tối ưu tiêu đề, mô tả và thẻ tag tự động để video của bạn dễ dàng lên top tìm kiếm.',
    image: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    icon: <AiIcon className="w-8 h-8 text-primary" />,
    title: 'Trợ lý AI Sáng tạo',
    description: 'Tạo ý tưởng video theo xu hướng, viết kịch bản cuốn hút, và tạo tiêu đề hấp dẫn chỉ trong vài giây.',
    image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    icon: <DragDropIcon className="w-8 h-8 text-primary" />,
    title: 'Giao diện Kéo và Thả',
    description: 'Quản lý và sắp xếp kế hoạch nội dung, theo dõi tiến độ sản xuất video một cách trực quan và hiệu quả.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const FeatureCard: React.FC<typeof features[0]> = ({ icon, title, description, image }) => (
    <div className="bg-card rounded-xl border border-secondary flex flex-col h-full mx-4 w-[400px] flex-shrink-0 overflow-hidden">
        <div className="w-full h-56">
            <img src={image} alt={title} className="w-full h-full object-cover"/>
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <div className="flex items-center mb-3 space-x-4">
                <div className="bg-background p-3 rounded-lg border border-secondary flex-shrink-0">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-text-main">{title}</h3>
            </div>
            <p className="text-text-secondary">{description}</p>
        </div>
    </div>
);


const FeaturesSection: React.FC = () => {
    const extendedFeatures = [...features, ...features];
  return (
    <section id="features" className="py-20 bg-background bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main">Tại Sao Chọn YT Pro Tools?</h2>
          <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
            Chúng tôi cung cấp bộ công cụ toàn diện giúp bạn tiết kiệm thời gian, sáng tạo không giới hạn và phát triển kênh bền vững.
          </p>
        </div>
      </div>
       <div className="relative w-full overflow-hidden group">
        <div className="flex animate-marquee group-hover:pause">
          {extendedFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute right-0 top-0 w-1/4 h-full bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;