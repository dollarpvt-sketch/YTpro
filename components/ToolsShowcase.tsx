
import React from 'react';

const tools = [
  { name: 'Nghiên cứu từ khóa', description: 'Tìm các từ khóa có lượng tìm kiếm cao và cạnh tranh thấp.', image: 'https://picsum.photos/seed/keyword/400/300' },
  { name: 'Phân tích đối thủ', description: 'Xem chiến lược của các kênh đối thủ để học hỏi và vượt qua.', image: 'https://picsum.photos/seed/competitor/400/300' },
  { name: 'Tạo tiêu đề AI', description: 'Tạo ra các tiêu đề hấp dẫn, thu hút lượt nhấp chuột.', image: 'https://picsum.photos/seed/title/400/300' },
  { name: 'Viết mô tả AI', description: 'Tự động tạo mô tả video chuẩn SEO và đầy đủ thông tin.', image: 'https://picsum.photos/seed/description/400/300' },
  { name: 'Trình quản lý Video', description: 'Lên lịch và quản lý tất cả video của bạn một cách dễ dàng.', image: 'https://picsum.photos/seed/manager/400/300' },
  { name: 'Kiểm tra A/B Thumbnail', description: 'Tìm ra hình thu nhỏ nào hoạt động hiệu quả nhất cho video của bạn.', image: 'https://picsum.photos/seed/abtest/400/300' },
];

const ToolsShowcase: React.FC = () => {
  return (
    <section id="tools" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main">Bộ Công Cụ Quyền Năng</h2>
          <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
            Khám phá các công cụ được thiết kế để giải quyết mọi thách thức của một nhà sáng tạo YouTube.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div key={tool.name} className="bg-card rounded-xl overflow-hidden group border border-secondary hover:border-primary transition-all duration-300">
              <img src={tool.image} alt={tool.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-text-main mb-2">{tool.name}</h3>
                <p className="text-text-secondary">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
