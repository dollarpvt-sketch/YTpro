
import React from 'react';
import { SeoIcon, AiIcon, DragDropIcon } from './IconComponents';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-card p-8 rounded-xl border border-secondary transition-all duration-300 hover:border-primary hover:-translate-y-2">
    <div className="mb-4 inline-block bg-secondary p-3 rounded-lg">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-text-main mb-3">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <SeoIcon className="w-8 h-8 text-primary" />,
      title: 'Tối ưu SEO YouTube',
      description: 'Phân tích từ khóa, tối ưu tiêu đề, mô tả và thẻ tag tự động để video của bạn dễ dàng lên top tìm kiếm.',
    },
    {
      icon: <AiIcon className="w-8 h-8 text-primary" />,
      title: 'Trợ lý AI Sáng tạo',
      description: 'Tạo ý tưởng video, viết kịch bản, và tạo tiêu đề hấp dẫn chỉ trong vài giây với sức mạnh của trí tuệ nhân tạo.',
    },
    {
      icon: <DragDropIcon className="w-8 h-8 text-primary" />,
      title: 'Giao diện Kéo và Thả',
      description: 'Quản lý và sắp xếp nội dung, kế hoạch video một cách trực quan và hiệu quả. Không cần kỹ năng kỹ thuật phức tạp.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main">Tại Sao Chọn YT Pro Tools?</h2>
          <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
            Chúng tôi cung cấp bộ công cụ toàn diện giúp bạn tiết kiệm thời gian, sáng tạo không giới hạn và phát triển kênh bền vững.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
