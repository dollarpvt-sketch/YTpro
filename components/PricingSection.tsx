
import React from 'react';
import { CheckIcon } from './IconComponents';

interface PricingCardProps {
  plan: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, period, features, isPopular }) => (
    <div className={`relative bg-card p-8 rounded-xl border ${isPopular ? 'border-primary' : 'border-secondary'} flex flex-col`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
          PHỔ BIẾN NHẤT
        </div>
      )}
      <h3 className="text-xl font-semibold text-text-main mb-2">{plan}</h3>
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-extrabold text-text-main">{price}</span>
        <span className="text-text-secondary ml-2">{period}</span>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-105 ${isPopular ? 'bg-primary text-white hover:bg-red-700' : 'bg-secondary text-text-main hover:bg-gray-700'}`}>
        Chọn Gói
      </button>
    </div>
);


const PricingSection: React.FC = () => {
  const plans = [
    {
      plan: 'Miễn phí',
      price: '0đ',
      period: '/mãi mãi',
      features: [
        '3 lượt nghiên cứu từ khóa/ngày',
        '1 kênh YouTube',
        'Phân tích SEO cơ bản',
        'Giới hạn tính năng AI'
      ],
    },
    {
      plan: 'Pro',
      price: '199.000đ',
      period: '/tháng',
      features: [
        'Nghiên cứu từ khóa không giới hạn',
        '5 kênh YouTube',
        'Phân tích SEO nâng cao',
        'Toàn bộ tính năng AI',
        'Phân tích đối thủ cạnh tranh',
        'Hỗ trợ ưu tiên'
      ],
      isPopular: true,
    },
    {
      plan: 'Doanh nghiệp',
      price: '499.000đ',
      period: '/tháng',
      features: [
        'Tất cả tính năng của gói Pro',
        '20 kênh YouTube',
        'Công cụ cho đội nhóm',
        'Báo cáo tùy chỉnh',
        'API access',
        'Hỗ trợ chuyên sâu'
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main">Bảng Giá Linh Hoạt</h2>
          <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
            Chọn gói phù hợp với nhu cầu và quy mô kênh của bạn. Bắt đầu miễn phí, nâng cấp bất cứ lúc nào.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((p, index) => (
            <PricingCard key={index} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
