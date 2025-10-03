import React from 'react';
import { ArrowRightIcon } from './IconComponents';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
       <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
       <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-text-main mb-6 leading-tight">
          Nâng Tầm Kênh YouTube Của Bạn Với <span className="text-primary">Công Cụ AI</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary mb-10">
          Tối ưu hóa SEO, tạo nội dung hấp dẫn và tăng trưởng vượt bậc. Tất cả trong một nền tảng duy nhất, dễ sử dụng.
        </p>
        <div className="flex justify-center items-center space-x-4">
          <button className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20">
            Bắt đầu miễn phí
          </button>
          <a href="#features" className="flex items-center text-text-main hover:text-primary transition-colors duration-300 group">
            <span>Tìm hiểu thêm</span>
            <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="mt-16">
          <img src="https://picsum.photos/1200/600?grayscale" alt="Dashboard Preview" className="rounded-xl shadow-2xl mx-auto border-4 border-secondary"/>
        </div>
      </div>
      {/* FIX: Removed unsupported `jsx` prop from `<style>` tag. This prop is for `styled-jsx` (used in Next.js) and causes errors in a standard React project. The styles are now rendered in a standard <style> tag. */}
      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 2rem 2rem;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;