import React from 'react';
import { ArrowRightIcon } from './IconComponents';
import CustomGoogleSignInButton from './CustomGoogleSignInButton';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-background to-background">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-text-main mb-6 leading-tight">
          San Phẳng Cuộc Chơi YouTube Bằng <span className="text-primary">AI</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary mb-10">
          Tối ưu hóa SEO, tạo nội dung hấp dẫn và tăng trưởng vượt bậc. Tất cả trong một nền tảng duy nhất, dễ sử dụng.
        </p>
        <div className="flex justify-center items-center flex-wrap gap-4">
          <CustomGoogleSignInButton className="bg-primary text-white hover:bg-red-700 px-8 py-4 text-lg">
            Bắt đầu miễn phí với Google
          </CustomGoogleSignInButton>
          <a href="#features" className="flex items-center text-text-main hover:text-primary transition-colors duration-300 group">
            <span>Tìm hiểu thêm</span>
            <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="mt-16">
          <img src="https://picsum.photos/1200/600?grayscale" alt="Dashboard Preview" className="rounded-xl shadow-2xl mx-auto border-4 border-secondary"/>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;