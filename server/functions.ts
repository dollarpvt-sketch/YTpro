import { GoogleGenAI, Type } from "@google/genai";

// A single GoogleGenAI instance for all functions
// The API_KEY is expected to be available on window.process.env from env.js
const apiKey = window.process?.env?.API_KEY;
if (!apiKey) {
    console.error("API_KEY is not defined. Please check your env.js file.");
}
const ai = new GoogleGenAI({ apiKey: apiKey! });

// --- MOCK / SIMULATED FUNCTIONS ---

// This is a placeholder for a real Text-to-Speech service.
// The Gemini API does not directly provide a TTS service in this manner.
// We are returning a sample MP3 URL for demonstration purposes.
export const generateAudio = async (
    text: string,
    voice: string,
    rate: number,
    pitch: number
): Promise<string> => {
    console.log('Simulating audio generation for:', { text, voice, rate, pitch });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real implementation, you would call a service like Google Cloud Text-to-Speech API
    // and get back a URL or base64 data.
    return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Example URL
};


// --- GEMINI API-POWERED FUNCTIONS ---

interface ScriptSection {
    section_title: string;
    dialogue: string;
    visual_cue: string;
    sound_cue: string;
}

interface GeneratedScript {
    title_options: string[];
    hook_options: string[];
    script_body: ScriptSection[];
    call_to_action: string;
}

interface ScriptInputs {
    topic: string;
    style: string;
    tone: string;
    audience: string;
    keywords: string;
    lengthType: 'duration' | 'words';
    duration: number; // in minutes
    wordCount: number;
}


export const generateScript = async (inputs: ScriptInputs): Promise<GeneratedScript> => {
    const lengthInstruction = inputs.lengthType === 'duration'
        ? `The video should be approximately ${inputs.duration} minutes long.`
        : `The script should be around ${inputs.wordCount} words.`;

    const prompt = `
        Create a detailed YouTube video script about "${inputs.topic}".
        - Style: ${inputs.style}.
        - Tone: ${inputs.tone}.
        - Target Audience: ${inputs.audience}.
        - SEO Keywords to include: ${inputs.keywords}.
        - Length constraint: ${lengthInstruction}
        
        The script should be structured with an introduction, multiple body sections, and a call to action.
        For each section, provide a section title, the dialogue/voiceover, a visual cue, and a sound cue.
        Also, provide 3 catchy title options and 3 engaging hook options for the video intro.
        Respond ONLY with a JSON object matching the specified schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title_options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    hook_options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    script_body: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                section_title: { type: Type.STRING },
                                dialogue: { type: Type.STRING },
                                visual_cue: { type: Type.STRING },
                                sound_cue: { type: Type.STRING }
                            },
                            required: ['section_title', 'dialogue', 'visual_cue', 'sound_cue']
                        }
                    },
                    call_to_action: { type: Type.STRING }
                },
                required: ['title_options', 'hook_options', 'script_body', 'call_to_action']
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", response.text);
        throw new Error("AI returned an invalid response format.");
    }
};

export const generateImages = async (prompt: string, numberOfImages: number, aspectRatio: string = '1:1'): Promise<string[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: numberOfImages,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });

    return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
};

export const getAiVoiceDirectorSuggestions = async (script: string): Promise<string[]> => {
    const prompt = `
        As a professional voice director, analyze the following script and provide 3-4 constructive suggestions to improve the voiceover delivery. 
        Focus on pacing, tone shifts, emphasis, and emotional delivery. 
        Keep each suggestion concise and actionable.
        
        Script:
        ---
        ${script}
        ---

        Respond with a JSON array of strings, where each string is a suggestion. For example: ["Suggestion 1", "Suggestion 2"].
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                },
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", response.text);
        throw new Error("AI returned an invalid response format for suggestions.");
    }
};

export const analyzeScriptForPrompts = async (script: string): Promise<string[]> => {
    const prompt = `
        Analyze the following video script and extract a list of visual prompts suitable for an AI image generator. 
        Each prompt should describe a distinct scene or key visual moment. 
        Focus on creating descriptive, concise prompts that capture the essence of the visual.
        Return a JSON array of strings, where each string is an image prompt.

        Script:
        ---
        ${script}
        ---
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                },
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", response.text);
        throw new Error("AI returned an invalid response format for prompts.");
    }
};

interface AnalysisResult {
    rewritten_script: string;
    analysis: {
        viral_potential_score: number;
        key_improvements: string[];
        original_reading_time_seconds: number;
        rewritten_reading_time_seconds: number;
    };
}

export const rewriteScript = async (script: string, lens: string): Promise<AnalysisResult> => {
    const prompt = `
        You are an expert YouTube script editor. Your task is to rewrite the provided script based on a specific "lens".
        After rewriting, provide a detailed analysis of the changes.

        Original Script:
        ---
        ${script}
        ---

        Lens to apply: ${lens}.
        - If 'viralize', focus on a strong hook, faster pacing, more engaging language, and a clear call-to-action.
        - If 'clarify', simplify complex sentences, remove jargon, and improve the overall flow for better understanding.
        - If 'seo', naturally weave in relevant keywords to improve searchability (assume keywords are 'AI', 'productivity', 'future').
        - If 'custom', apply any specific instructions provided (for this simulation, you can just make it more professional).

        Also, perform an analysis:
        1.  **viral_potential_score**: An integer score from 0-100 for the NEW script.
        2.  **key_improvements**: A list of 3-4 bullet points (strings) explaining the main changes you made.
        3.  **original_reading_time_seconds**: Estimate reading time in seconds for the ORIGINAL script (assume 150 words per minute).
        4.  **rewritten_reading_time_seconds**: Estimate reading time in seconds for the REWRITTEN script.

        Respond ONLY with a JSON object matching the specified schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    rewritten_script: { type: Type.STRING },
                    analysis: {
                        type: Type.OBJECT,
                        properties: {
                            viral_potential_score: { type: Type.INTEGER },
                            key_improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                            original_reading_time_seconds: { type: Type.INTEGER },
                            rewritten_reading_time_seconds: { type: Type.INTEGER }
                        },
                        required: ['viral_potential_score', 'key_improvements', 'original_reading_time_seconds', 'rewritten_reading_time_seconds']
                    }
                },
                required: ['rewritten_script', 'analysis']
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", response.text);
        throw new Error("AI returned an invalid response format for script rewrite.");
    }
};

export interface OverallSEOInputs {
    topic: string;
    keywords: string;
    channelLink: string;
    businessEmail: string;
    targetAudience: string;
    desiredEmotion: string;
}

interface SEOTitle {
    text: string;
    score: number;
}

interface SEOTags {
    tags: string[];
    characterCount: number;
}

interface SEOChecklist {
    keywordRepetition: number;
    keywordsInTitle: number;
    keywordsInDescription: number;
    tagCount: number;
    performance: number;
    rankingTags: number;
    highVolumeTags: number;
}

interface ThumbnailConcept {
    conceptDescription: string;
    colorPairs: string[];
    facialExpression: string;
    objects: string[];
    score: number;
}

export interface OverallSEOResult {
    titles: SEOTitle[];
    description: string;
    tags: SEOTags;
    checklist: SEOChecklist;
    thumbnails: ThumbnailConcept[];
}

export const generateOverallSEO = async (inputs: OverallSEOInputs): Promise<OverallSEOResult> => {
    const prompt = `
        You are a world-class YouTube SEO and virality expert, like a combination of MrBeast's strategy team and vidIQ's data science team. Your task is to generate a complete SEO and creative package for a video.

        **Video Details:**
        - **Topic:** "${inputs.topic}"
        - **Main Keywords:** "${inputs.keywords}"
        - **Target Audience:** "${inputs.targetAudience}"
        - **Desired Emotion for Thumbnail:** "${inputs.desiredEmotion}"
        - **Creator's Channel Link:** "${inputs.channelLink}"
        - **Creator's Business Email:** "${inputs.businessEmail}"

        **Your Task:**
        Generate a JSON object with the following structure and strictly adhere to these rules:

        **1. Titles (\`titles\`):**
        - Generate EXACTLY 3 unique, highly-clickable titles.
        - Each title MUST be under 60 characters.
        - Each title MUST incorporate these viral elements: a Number, Curiosity, a clear Benefit, and a sense of Urgency or Warning.
        - Each title MUST end with 2 or 3 relevant hashtags.
        - Provide an SEO score from 0-100 for each title.

        **2. Thumbnail Concepts (\`thumbnails\`):**
        - Based on the Topic and Desired Emotion ("${inputs.desiredEmotion}"), generate EXACTLY 3 distinct thumbnail concepts.
        - For each concept, provide:
            - \`conceptDescription\`: A short, compelling description of the thumbnail's story.
            - \`colorPairs\`: Two high-contrast color pairs (e.g., ["Yellow & Black", "Cyan & Magenta"]).
            - \`facialExpression\`: A clear description of the human facial expression (e.g., "Shocked open mouth, wide eyes").
            - \`objects\`: A list of 2 key objects or icons to include (e.g., ["Explosion icon", "Question mark"]).
            - \`score\`: A score from 0-100 evaluating its potential to get clicks.

        **3. Description (\`description\`):**
        - Write a compelling, keyword-rich description of about 200-300 words.
        - The description MUST be well-structured and easy to read. Use line breaks to create short paragraphs (2-3 sentences each).
        - Strategically use relevant emojis (like 🚀, ✅, 👉) to make the text more engaging and break up sections.
        - The structure MUST be:
            1. The first line contains exactly 5 relevant primary hashtags.
            2. The main body of the description, formatted with short paragraphs and emojis.
            3. A section for contact information, which MUST include the creator's channel link and business email.
            4. The final section MUST be a list of 10 additional, broader hashtags.

        **4. Tags (\`tags\`):**
        - Generate a list of 30 to 40 highly relevant tags.
        - Total character count MUST NOT exceed 500 characters.
        - The first tag MUST be the most important keyword.
        - Include a mix of broad, specific, long-tail, and short-tail tags.
        - Calculate and provide the \`characterCount\`.

        **5. SEO Checklist (\`checklist\`):**
        - Evaluate YOUR OWN generated content and provide a score from 0 to 5 for each item.
        - \`keywordRepetition\`, \`keywordsInTitle\`, \`keywordsInDescription\`, \`tagCount\`, \`performance\`, \`rankingTags\`, \`highVolumeTags\`.

        Respond ONLY with the JSON object that matches the specified schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.8,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    titles: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                text: { type: Type.STRING },
                                score: { type: Type.INTEGER }
                            },
                            required: ["text", "score"]
                        }
                    },
                    thumbnails: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                conceptDescription: { type: Type.STRING },
                                colorPairs: { type: Type.ARRAY, items: { type: Type.STRING } },
                                facialExpression: { type: Type.STRING },
                                objects: { type: Type.ARRAY, items: { type: Type.STRING } },
                                score: { type: Type.INTEGER }
                            },
                            required: ["conceptDescription", "colorPairs", "facialExpression", "objects", "score"]
                        }
                    },
                    description: { type: Type.STRING },
                    tags: {
                        type: Type.OBJECT,
                        properties: {
                            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                            characterCount: { type: Type.INTEGER }
                        },
                        required: ["tags", "characterCount"]
                    },
                    checklist: {
                        type: Type.OBJECT,
                        properties: {
                            keywordRepetition: { type: Type.INTEGER },
                            keywordsInTitle: { type: Type.INTEGER },
                            keywordsInDescription: { type: Type.INTEGER },
                            tagCount: { type: Type.INTEGER },
                            performance: { type: Type.INTEGER },
                            rankingTags: { type: Type.INTEGER },
                            highVolumeTags: { type: Type.INTEGER }
                        },
                        required: ["keywordRepetition", "keywordsInTitle", "keywordsInDescription", "tagCount", "performance", "rankingTags", "highVolumeTags"]
                    }
                },
                required: ["titles", "thumbnails", "description", "tags", "checklist"]
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", response.text);
        throw new Error("AI returned an invalid response format for SEO generation.");
    }
};