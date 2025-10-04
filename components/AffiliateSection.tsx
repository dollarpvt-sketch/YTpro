import React from 'react';
import ImageCarousel from './ImageCarousel';

const affiliateImages = [
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1469&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=1364&auto=format&fit=crop'
];

interface AffiliateSectionProps {
  onJoinClick: () => void;
}

const AffiliateSection: React.FC<AffiliateSectionProps> = ({ onJoinClick }) => {
  return (
    <section id="affiliate" className="py-20 bg-background bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent">
      <div className="container mx-auto px-6">
        <div className="bg-card rounded-xl p-8 md:p-12 border border-secondary flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-text-main mb-4">Trở thành Đối tác của chúng tôi</h2>
            <p className="text-text-secondary mb-6">
              Tham gia chương trình Affiliate của YT Pro Tools và nhận hoa hồng hấp dẫn khi giới thiệu người dùng mới. Cùng nhau phát triển và thành công.
            </p>
            <button 
              onClick={onJoinClick}
              className="bg-accent hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-accent/20"
            >
              Tham gia ngay
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
             <div className="rounded-lg shadow-xl w-full max-w-md aspect-video overflow-hidden border-2 border-secondary">
                <ImageCarousel images={affiliateImages} />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliateSection;