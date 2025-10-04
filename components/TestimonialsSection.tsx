import React from 'react';
import { StarIcon } from './IconComponents';

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  { name: 'Linh Chi Vlogs', handle: '@linhchivlogs', avatar: 'https://i.pravatar.cc/100?u=1', quote: 'Từ khi dùng YT Pro Tools, mình không còn đau đầu nghĩ content mỗi ngày nữa. Trợ lý AI thực sự là cứu cánh!', rating: 5 },
  { name: 'Hùng Gamer', handle: '@hunggamer', avatar: 'https://i.pravatar.cc/100?u=2', quote: 'Công cụ phân tích của app quá đỉnh. Mình biết được fan thích xem gì và tối ưu video tốt hơn hẳn.', rating: 5 },
  { name: 'Bếp Nhà An', handle: '@bepnhaan', avatar: 'https://i.pravatar.cc/100?u=3', quote: 'Giao diện kéo thả rất dễ dùng, mình là dân không rành công nghệ mà vẫn quản lý kênh ngon ơ.', rating: 5 },
  { name: 'Travel with K', handle: '@travelwithk', avatar: 'https://i.pravatar.cc/100?u=4', quote: 'Nghiên cứu từ khóa giờ nhanh gấp 10 lần. Video của mình có nhiều lượt xem từ tìm kiếm hơn hẳn.', rating: 5 },
  { name: 'DIY Cùng Tí', handle: '@diycungti', avatar: 'https://i.pravatar.cc/100?u=5', quote: 'Tính năng A/B test thumbnail đã giúp mình tăng CTR lên 20%. Không thể tin được!', rating: 5 },
  { name: 'Reviewer Có Tâm', handle: '@reviewer_cotam', avatar: 'https://i.pravatar.cc/100?u=6', quote: 'Đây là khoản đầu tư xứng đáng nhất cho kênh của mình. Tiết kiệm thời gian, tăng hiệu quả rõ rệt.', rating: 5 },
  { name: 'Anh Chàng Crypto', handle: '@anhchangcrypto', avatar: 'https://i.pravatar.cc/100?u=7', quote: 'Dữ liệu và phân tích đối thủ mà app cung cấp rất chính xác, giúp mình có chiến lược nội dung tốt hơn.', rating: 4 },
  { name: 'Cô Giáo Thảo', handle: '@cogiaothao', avatar: 'https://i.pravatar.cc/100?u=8', quote: 'Mình dùng để quản lý kênh giáo dục và rất hài lòng. Các công cụ giúp bài giảng của mình tiếp cận nhiều học sinh hơn.', rating: 5 },
  { name: 'Music Mix', handle: '@musicmix', avatar: 'https://i.pravatar.cc/100?u=9', quote: 'Đối với một kênh nhạc, SEO là tất cả. YT Pro Tools đã giúp các bản mix của mình lên top tìm kiếm.', rating: 5 },
  { name: 'Phim Hay Mỗi Ngày', handle: '@phimhaymoingay', avatar: 'https://i.pravatar.cc/100?u=10', quote: 'Quản lý lịch đăng video chưa bao giờ dễ dàng đến thế. Rất khuyến khích các bạn creator khác dùng thử.', rating: 5 },
];

const TestimonialCard: React.FC<Testimonial> = ({ name, handle, avatar, quote, rating }) => (
  <div className="bg-card p-6 rounded-xl border border-secondary flex flex-col h-full mx-4 w-[350px] flex-shrink-0">
    <div className="flex items-center mb-4">
      <img src={avatar} alt={name} className="w-14 h-14 rounded-full mr-4 border-2 border-primary" />
      <div>
        <p className="font-bold text-text-main text-lg">{name}</p>
        <p className="text-text-secondary">{handle}</p>
      </div>
    </div>
    <p className="text-text-secondary italic mb-4 flex-grow">"{quote}"</p>
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`} />
      ))}
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const extendedTestimonials = [...testimonials, ...testimonials]; // Duplicate for seamless loop

  return (
    <section id="testimonials" className="py-20 bg-background bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main">Được Tin Dùng Bởi Các Nhà Sáng Tạo</h2>
          <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
            Xem những gì cộng đồng YouTuber nói về chúng tôi và cách chúng tôi đã giúp họ phát triển kênh.
          </p>
        </div>
      </div>
      <div className="relative w-full overflow-hidden group">
        <div className="flex animate-marquee group-hover:pause">
          {extendedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
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
          animation: marquee 60s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
        /* Overriding the gradient color for the fades */
        .from-card {
            --tw-gradient-from: #121212 var(--tw-gradient-from-position);
            --tw-gradient-to: rgba(18, 18, 18, 0) var(--tw-gradient-to-position);
            --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }
        .from-background {
            --tw-gradient-from: #121212 var(--tw-gradient-from-position);
            --tw-gradient-to: rgba(18, 18, 18, 0) var(--tw-gradient-to-position);
            --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;