
import React from 'react';
import { YouTubeIcon } from './IconComponents';

const Footer: React.FC = () => {
    const footerLinks = {
        'Sản phẩm': [
            { name: 'Tính năng', href: '#features' },
            { name: 'Công cụ', href: '#tools' },
            { name: 'Giá', href: '#pricing' },
            { name: 'Affiliate', href: '#affiliate' },
        ],
        'Công ty': [
            { name: 'Về chúng tôi', href: '#' },
            { name: 'Liên hệ', href: '#' },
            { name: 'Blog', href: '#' },
        ],
        'Pháp lý': [
            { name: 'Điều khoản dịch vụ', href: '#' },
            { name: 'Chính sách bảo mật', href: '#' },
        ],
    };

    const socialLinks = [
      { name: 'Facebook', href: '#', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.582 0 0 .582 0 1.297v21.351C0 23.418.582 24 1.297 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.816c.715 0 1.297-.582 1.297-1.297V1.297C24 .582 23.418 0 22.675 0z" /></svg> },
      { name: 'Twitter', href: '#', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.52 3.379 4.738 3.419a9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg> },
      { name: 'Instagram', href: '#', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.552 0-3.91.015-5.266.077-2.813.128-4.013 1.32-4.142 4.142-.062 1.356-.077 1.714-.077 5.266s.015 3.91.077 5.266c.129 2.821 1.329 4.013 4.142 4.142 1.356.062 1.714.077 5.266.077s3.91-.015 5.266-.077c2.813-.129 4.013-1.32 4.142-4.142.062-1.356.077-1.714.077-5.266s-.015-3.91-.077-5.266c-.129-2.821-1.329-4.013-4.142-4.142-1.356-.062-1.714-.077-5.266-.077zM12 7.838a4.162 4.162 0 100 8.324 4.162 4.162 0 000-8.324zm0 6.525a2.363 2.363 0 110-4.725 2.363 2.363 0 010 4.725zM18.23 6.364a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg> },
    ];
    
    return (
        <footer className="bg-background border-t border-secondary">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="col-span-2 lg:col-span-1 mb-8 lg:mb-0">
                        <div className="flex items-center space-x-2 mb-4">
                            <YouTubeIcon className="w-8 h-8 text-primary" />
                            <span className="text-xl font-bold text-text-main">YT Pro Tools</span>
                        </div>
                        <p className="text-text-secondary">Nền tảng toàn diện cho các nhà sáng tạo YouTube.</p>
                    </div>
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-text-main mb-4">{title}</h4>
                            <ul className="space-y-3">
                                {links.map(link => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-text-secondary hover:text-text-main transition-colors duration-300">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 pt-8 border-t border-secondary flex flex-col md:flex-row justify-between items-center">
                    <p className="text-text-secondary text-sm">&copy; {new Date().getFullYear()} YT Pro Tools. All Rights Reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        {socialLinks.map(social => (
                            <a key={social.name} href={social.href} className="text-text-secondary hover:text-text-main transition-colors duration-300">
                                <span className="sr-only">{social.name}</span>
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
