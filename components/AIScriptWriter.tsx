import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AiIcon, SpinnerIcon, WandIcon } from './IconComponents';

interface Script {
    title: string;
    hook: string;
    introduction: string;
    main_points: { point: string; details: string; }[];
    conclusion: string;
    call_to_action: string;
}

const AIScriptWriter: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [script, setScript] = useState<Script | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateScript = async () => {
        if (!topic.trim()) {
            setError('Vui lòng nhập chủ đề cho video.');
            return;
        }

        const apiKey = window.process?.env?.API_KEY;
        if (!apiKey) {
            setError('API Key chưa được cấu hình trong file env.js.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setScript(null);

        try {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Bạn là một chuyên gia viết kịch bản video YouTube. Hãy tạo một kịch bản chi tiết cho video về chủ đề sau: "${topic}". Kịch bản phải có cấu trúc rõ ràng bao gồm: tiêu đề hấp dẫn, một đoạn hook (mở đầu) gây tò mò, phần giới thiệu, 3-4 điểm chính (main points) với chi tiết, phần kết luận tóm tắt, và một lời kêu gọi hành động (call to action) mạnh mẽ. Trả về kết quả dưới dạng một đối tượng JSON tuân thủ schema đã cho.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: 'Tiêu đề video cuốn hút, tối ưu SEO.' },
                            hook: { type: Type.STRING, description: 'Câu mở đầu gây sốc hoặc tò mò trong 3-5 giây đầu tiên.' },
                            introduction: { type: Type.STRING, description: 'Giới thiệu ngắn gọn về nội dung video và giá trị mang lại.' },
                            main_points: {
                                type: Type.ARRAY,
                                description: '3-4 luận điểm chính, mỗi luận điểm có tiêu đề và nội dung chi tiết.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        point: { type: Type.STRING, description: 'Tiêu đề của luận điểm chính.' },
                                        details: { type: Type.STRING, description: 'Nội dung chi tiết, giải thích cho luận điểm.' }
                                    },
                                    required: ['point', 'details']
                                }
                            },
                            conclusion: { type: Type.STRING, description: 'Tóm tắt lại các điểm chính và thông điệp cuối cùng.' },
                            call_to_action: { type: Type.STRING, description: 'Kêu gọi người xem thích, chia sẻ, đăng ký kênh hoặc xem video khác.' }
                        },
                        required: ['title', 'hook', 'introduction', 'main_points', 'conclusion', 'call_to_action']
                    }
                }
            });

            if (response.text) {
                const result = JSON.parse(response.text);
                setScript(result);
            } else {
                setError('Không thể tạo kịch bản. Vui lòng thử lại.');
            }
        } catch (e) {
            console.error(e);
            setError(`Đã xảy ra lỗi khi kết nối với AI. ${e instanceof Error ? e.message : 'Kiểm tra API key và thử lại.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="script-writer" className="py-20 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-background to-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <div className="flex justify-center items-center gap-4 mb-4">
                        <AiIcon className="w-10 h-10 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main">Trợ Lý Viết Kịch Bản AI</h2>
                    </div>
                    <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
                        Bí ý tưởng? Chỉ cần nhập chủ đề, trợ lý AI sẽ phác thảo một kịch bản hoàn chỉnh, cấu trúc chuyên nghiệp cho video tiếp theo của bạn.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-card border border-secondary rounded-xl p-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Nhập chủ đề video của bạn..."
                                className="w-full bg-background border border-secondary rounded-lg px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-lg"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleGenerateScript}
                                disabled={isLoading}
                                className="w-full md:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2 flex-shrink-0"
                            >
                                {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <WandIcon className="w-6 h-6" />}
                                <span>{isLoading ? 'Đang viết...' : 'Tạo Kịch Bản'}</span>
                            </button>
                        </div>
                        {error && <p className="text-red-400 mt-4 text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}
                    </div>

                    {isLoading && (
                        <div className="mt-8 text-center">
                            <SpinnerIcon className="w-12 h-12 text-primary animate-spin mx-auto" />
                            <p className="text-text-secondary mt-4">AI đang sáng tạo, vui lòng chờ trong giây lát...</p>
                        </div>
                    )}

                    {script && (
                        <div className="mt-8 bg-card border border-secondary rounded-xl p-8 animate-fade-in">
                            <h3 className="text-2xl font-bold text-primary mb-4">{script.title}</h3>
                            <div className="space-y-6 text-text-secondary script-content">
                                <div><h4 className="font-bold text-text-main">Mở đầu (Hook):</h4><p>{script.hook}</p></div>
                                <div><h4 className="font-bold text-text-main">Giới thiệu:</h4><p>{script.introduction}</p></div>
                                <div>
                                    <h4 className="font-bold text-text-main">Nội dung chính:</h4>
                                    <ul className="list-disc list-inside space-y-4 pl-4 mt-2">
                                        {script.main_points.map((point, index) => (
                                            <li key={index}>
                                                <strong className="text-text-main">{point.point}</strong>
                                                <p className="pl-6">{point.details}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div><h4 className="font-bold text-text-main">Kết luận:</h4><p>{script.conclusion}</p></div>
                                <div><h4 className="font-bold text-text-main">Kêu gọi hành động:</h4><p>{script.call_to_action}</p></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .script-content p {
                    line-height: 1.7;
                    margin-top: 0.5rem;
                }
            `}</style>
        </section>
    );
};

export default AIScriptWriter;
