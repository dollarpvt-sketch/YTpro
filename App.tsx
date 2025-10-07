import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Modal from './components/Modal';
import AffiliateProgram from './components/AffiliateProgram';
import { AboutUsContent, ContactContent, BlogContent, TermsOfServiceContent, PrivacyPolicyContent } from './components/LegalContent';
import { ArrowLeftIcon } from './components/IconComponents';

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
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';

const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode }>({ title: '', content: null });
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const showModal = (title: string, content: React.ReactNode) => {
        setModalContent({ title, content });
        setIsModalOpen(true);
    };
    
    const handleFooterLinkClick = (pageId: string) => {
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
    
    const goBackToDashboard = () => {
        setActiveTool(null);
    };

    const renderActiveTool = () => {
        const toolMap: { [key: string]: React.ReactNode } = {
            'script-writer': <AIScriptWriter />,
            'script-rewriter': <AIScriptRewriter />,
            'text-to-speech': <TextToSpeech />,
            'image-generator': <ImageGenerator />,
            'video-generator': <div className="bg-card rounded-xl p-8 container mx-auto"><VideoGenerator /></div>,
            'youtube-tricks': <YouTubeTricks />,
            'channel-discovery': <AIDiscovery />,
            'video-manager': <VideoManager />,
            'bulk-editor': <BulkEditor />,
            'automation': <SocialAutomation />,
        };
        const toolComponent = toolMap[activeTool || ''] || null;

        return (
             <div className="py-8 px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={goBackToDashboard} 
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-text-main mb-8 transition-colors group"
                >
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span>Quay lại Bảng điều khiển</span>
                </button>
                {toolComponent}
            </div>
        );
    };

    return (
        <AuthProvider>
            <div className="bg-background text-text-main font-sans min-h-screen">
                <DashboardLayout onFooterLinkClick={handleFooterLinkClick}>
                    {activeTool ? (
                        renderActiveTool()
                    ) : (
                        <Dashboard onSelectTool={setActiveTool} />
                    )}
                </DashboardLayout>
                
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
                    {modalContent.content}
                </Modal>
            </div>
        </AuthProvider>
    );
};

export default App;
