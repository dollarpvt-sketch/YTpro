import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ToolsShowcase from './components/ToolsShowcase';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import AffiliateSection from './components/AffiliateSection';
import Footer from './components/Footer';
import Modal from './components/Modal';
import AffiliateProgram from './components/AffiliateProgram';
import { AboutUsContent, ContactContent, BlogContent, TermsOfServiceContent, PrivacyPolicyContent } from './components/LegalContent';

// Import all tool components
import AIScriptWriter from './components/AIScriptWriter';
import AIScriptRewriter from './components/AIScriptRewriter';
import TextToSpeech from './components/TextToSpeech';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import YouTubeTricks from './components/YouTubeTricks';
import AIDiscovery from './components/AIDiscovery';
import VideoManager from './components/VideoManager';
import BulkEditor from './components/BulkEditor';
import SocialAutomation from './components/SocialAutomation';
import { ArrowLeftIcon } from './components/IconComponents';


const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode }>({ title: '', content: null });
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const showModal = (title: string, content: React.ReactNode) => {
        setModalContent({ title, content });
        setIsModalOpen(true);
    };

    const handleLinkClick = (pageId: string) => {
        switch (pageId) {
            case 'affiliate-join':
                showModal('Chương trình Affiliate', <AffiliateProgram />);
                break;
            case 'about':
                showModal('Về Chúng Tôi', <AboutUsContent />);
                break;
            case 'contact':
                showModal('Liên Hệ', <ContactContent />);
                break;
            case 'blog':
                showModal('Blog', <BlogContent />);
                break;
            case 'terms':
                showModal('Điều khoản Dịch vụ', <TermsOfServiceContent />);
                break;
            case 'privacy':
                showModal('Chính sách Bảo mật', <PrivacyPolicyContent />);
                break;
            default:
                console.warn(`Unknown pageId: ${pageId}`);
                break;
        }
    };

    const goHome = () => {
        setActiveTool(null);
        setIsModalOpen(false);
        // Use timeout to ensure state update before scrolling
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0);
    };
    
    const renderActiveTool = () => {
        const toolMap: { [key: string]: React.ReactNode } = {
            'script-writer': <AIScriptWriter />,
            'script-rewriter': <AIScriptRewriter />,
            'text-to-speech': <TextToSpeech />,
            'image-generator': <ImageGenerator />,
            'video-generator': <div className="bg-card border border-secondary rounded-xl p-8 container mx-auto"><VideoGenerator /></div>,
            'youtube-tricks': <YouTubeTricks />,
            'channel-discovery': <AIDiscovery />,
            'video-manager': <VideoManager />,
            'bulk-editor': <BulkEditor />,
            'automation': <SocialAutomation />,
        };
        return toolMap[activeTool || ''] || null;
    };

    return (
        <AuthProvider>
            <div className="bg-background text-text-main font-sans min-h-screen flex flex-col">
                <Header onGoHome={goHome} />
                <main className="flex-grow">
                    {activeTool === null ? (
                        <>
                            <HeroSection />
                            <FeaturesSection />
                            <ToolsShowcase onSelectTool={setActiveTool} />
                            <TestimonialsSection />
                            <PricingSection />
                            <AffiliateSection onJoinClick={() => showModal('Trở thành Đối tác của chúng tôi', <AffiliateProgram />)} />
                        </>
                    ) : (
                        <div className="container mx-auto px-6 py-12">
                            <button 
                                onClick={() => setActiveTool(null)} 
                                className="inline-flex items-center gap-2 text-text-secondary hover:text-text-main mb-8 transition-colors group"
                            >
                                <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                <span>Quay lại tất cả công cụ</span>
                            </button>
                            {renderActiveTool()}
                        </div>
                    )}
                </main>
                <Footer onLinkClick={handleLinkClick} />
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
                    {modalContent.content}
                </Modal>
            </div>
        </AuthProvider>
    );
};

export default App;
