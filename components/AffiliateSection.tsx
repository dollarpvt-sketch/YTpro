
import React from 'react';

const AffiliateSection: React.FC = () => {
  return (
    <section id="affiliate" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="bg-card rounded-xl p-8 md:p-12 border border-secondary flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-text-main mb-4">Trở thành Đối tác của chúng tôi</h2>
            <p className="text-text-secondary mb-6">
              Tham gia chương trình Affiliate của YT Pro Tools và nhận hoa hồng hấp dẫn khi giới thiệu người dùng mới. Cùng nhau phát triển và thành công.
            </p>
            <button className="bg-accent hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-accent/20">
              Tham gia ngay
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="https://picsum.photos/seed/affiliate/500/350" alt="Affiliate Program" className="rounded-lg shadow-xl"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliateSection;
