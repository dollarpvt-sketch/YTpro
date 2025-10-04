import React from 'react';
import { BoltIcon } from './IconComponents';

const socialPlatforms = [
  { 
    name: 'Facebook', 
    description: 'Tự động đăng video của bạn lên Facebook Page ngay sau khi xuất bản trên YouTube.',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.675 0h-21.35C.582 0 0 .582 0 1.297v21.351C0 23.418.582 24 1.297 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.816c.715 0 1.297-.582 1.297-1.297V1.297C24 .582 23.418 0 22.675 0z" />
      </svg>
    )
  },
  { 
    name: 'TikTok', 
    description: 'Tạo và đăng các video ngắn hoặc teaser lên TikTok để thu hút thêm người xem về kênh chính.',
    icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.98-1.75-2.22-2.02-5.02-1.07-7.58.94-2.52 3.42-4.11 6.2-4.23 2.57-.12 4.94.94 6.08 3.02.47.86.67 1.83.67 2.79.05 1.08-.28 2.15-.82 3.06-.39.63-1.01 1.12-1.72 1.34-1.06.33-2.22.18-3.2-.38-.85-.49-1.42-1.36-1.42-2.31.01-.82.4-1.61.97-2.19.01-.01.01-.02.01-.02z"/>
        </svg>
    )
  },
  { 
    name: 'Instagram', 
    description: 'Chia sẻ các clip nổi bật, ảnh hậu trường hoặc thông báo video mới lên Instagram Reels và Stories.',
    icon: (
        <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <defs><radialGradient id="insta-gradient" cx=".3" cy=".3" r="1"><stop offset="0" stopColor="#fdf497"/><stop offset=".1" stopColor="#fdf497"/><stop offset=".5" stopColor="#fd5949"/><stop offset="1" stopColor="#d6249f"/></radialGradient></defs>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.552 0-3.91.015-5.266.077-2.813.128-4.013 1.32-4.142 4.142-.062 1.356-.077 1.714-.077 5.266s.015 3.91.077 5.266c.129 2.821 1.329 4.013 4.142 4.142 1.356.062 1.714.077 5.266.077s3.91-.015 5.266-.077c2.813-.129 4.013-1.32 4.142-4.142.062-1.356.077-1.714-.077-5.266s-.015-3.91-.077-5.266c-.129-2.821-1.329-4.013-4.142-4.142-1.356-.062-1.714-.077-5.266-.077zM12 7.838a4.162 4.162 0 100 8.324 4.162 4.162 0 000-8.324zm0 6.525a2.363 2.363 0 110-4.725 2.363 2.363 0 010 4.725zM18.23 6.364a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" fill="url(#insta-gradient)"/>
        </svg>
    )
  },
];

const SocialAutomation: React.FC = () => {
  return (
    <section id="automation" className="py-20 bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
           <div className="flex justify-center items-center gap-4 mb-4">
               <BoltIcon className="w-10 h-10 text-primary" />
               <h2 className="text-3xl md:text-4xl font-bold text-text-main">AI Automation</h2>
           </div>
          <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
            Tiết kiệm thời gian và tiếp cận nhiều khán giả hơn bằng cách tự động hóa quy trình đăng tải nội dung của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="bg-card rounded-xl p-6 border border-secondary flex flex-col items-center text-center">
              <div className="bg-background p-3 rounded-lg border border-secondary mb-4">
                  {platform.icon}
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">{platform.name}</h3>
              <p className="text-text-secondary flex-grow mb-6">{platform.description}</p>
              <button disabled className="w-full bg-secondary text-text-secondary font-semibold py-2 px-4 rounded-lg cursor-not-allowed relative group">
                Sắp ra mắt
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Tính năng này đang được phát triển
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialAutomation;
