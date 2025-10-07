import React from 'react';
// FIX: Imported PlayIcon and aliased it as VideoIcon as it was not exported from IconComponents.
import { ImageIcon, PlayIcon as VideoIcon } from './IconComponents';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-red-500/80 to-accent/80 p-8 md:p-10 rounded-2xl overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Tạo bất cứ thứ gì bằng AI theo cách của bạn
            </h1>
            <p className="text-white/80 max-w-xl text-sm md:text-base">
                Bạn có thể tùy chọn tạo từ đầu, sử dụng mẫu có sẵn hoặc một số công cụ AI thành thạo.
            </p>
            <div className="mt-6 flex items-center gap-3">
                <button className="bg-white text-black font-semibold py-2.5 px-6 rounded-full text-sm flex items-center gap-2 shadow-lg hover:bg-gray-200 transition-colors">
                    <VideoIcon className="w-5 h-5"/>
                    <span>Video</span>
                </button>
                 <button className="bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-6 rounded-full text-sm flex items-center gap-2 hover:bg-white/30 transition-colors">
                    <ImageIcon className="w-5 h-5"/>
                    <span>Hình ảnh</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default HeroBanner;