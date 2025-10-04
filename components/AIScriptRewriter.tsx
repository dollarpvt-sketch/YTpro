import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RefreshIcon, SpinnerIcon } from './IconComponents';

const AIScriptRewriter: React.FC = () => {
    const [originalScript, setOriginalScript] = useState('');
    const [rewrittenScript, setRewrittenScript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRewriteScript = async () => {
        if (!originalScript.trim()) {
            setError('Vui lòng dán kịch bản gốc vào ô bên trái.');
            return;
        }

        const apiKey = window.process?.env?.API_KEY;
        if (!apiKey) {
            setError('API Key chưa được cấu hình trong file env.js.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setRewrittenScript('');

        try {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Bạn là một chuyên gia biên tập kịch bản YouTube. Hãy đọc kịch bản dưới đây và viết lại nó. Mục tiêu là làm cho kịch bản trở nên hấp dẫn, lôi cuốn hơn, tăng tỷ lệ giữ chân người xem (retention rate) và tối ưu cho thuật toán YouTube. Hãy cải thiện câu từ, cấu trúc, thêm các yếu tố gây tò mò và kêu gọi hành động mạnh mẽ hơn.\n\nKịch bản gốc:\n"""\n${originalScript}\n"""`;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            if (response.text) {
                setRewrittenScript(response.text);
            } else {
                setError('Không thể viết lại kịch bản. Vui lòng thử lại.');
            }
        } catch (e) {
            console.error(e);
            setError('Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="script-rewriter" className="py-20 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main">Công Cụ Viết Lại & Cải Tiến Kịch Bản</h2>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Đã có sẵn kịch bản nhưng cảm thấy chưa đủ "chất"? Hãy để AI của chúng tôi biến nó thành một tác phẩm có khả năng viral.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-card border border-secondary rounded-xl p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Kịch bản gốc</h3>
                            <textarea
                                value={originalScript}
                                onChange={(e) => setOriginalScript(e.target.value)}
                                placeholder="Dán kịch bản bạn muốn cải tiến vào đây..."
                                className="w-full h-80 bg-background border border-secondary rounded-lg p-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Kịch bản đã cải tiến</h3>
                             <div className="w-full h-80 bg-background border border-secondary rounded-lg p-4 text-text-secondary whitespace-pre-wrap overflow-y-auto">
                                {rewrittenScript || "Kết quả sẽ xuất hiện ở đây..."}
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleRewriteScript}
                            disabled={isLoading}
                            className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2"
                        >
                            {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <RefreshIcon className="w-6 h-6"/>}
                            <span>{isLoading ? 'Đang phân tích...' : 'Viết Lại Kịch Bản'}</span>
                        </button>
                    </div>

                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </div>
            </div>
        </section>
    );
};

export default AIScriptRewriter;
