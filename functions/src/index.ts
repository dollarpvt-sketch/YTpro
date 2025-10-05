import { HttpFunction } from '@google-cloud/functions-framework';
import fetch from 'node-fetch';
import cors from 'cors';

// Initialize CORS middleware
const corsMiddleware = cors({ origin: true });

interface Channel {
    name: string;
    subscriberCount: string;
    subscriberGrowth: {
        last7Days: string;
        last30Days: string;
    };
    avgViews: string;
    niche: string;
}

interface Video {
    title: string;
    channelName: string;
    views: string;
    vph: string;
    viralIndex: number;
    uploadDate: string;
}

interface AnalysisResult {
    trendingChannels: Channel[];
    viralVideos: Video[];
}

// This is the main Cloud Function that will be deployed.
export const discoverChannels: HttpFunction = (req, res) => {
    corsMiddleware(req, res, async () => {
        // Use POST method for real applications to send data in the body
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const { query } = req.body;
        if (!query) {
            return res.status(400).send('Missing "query" in request body.');
        }

        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            console.error("API_KEY environment variable is not set.");
            return res.status(500).send('Server configuration error: API key is missing.');
        }

        try {
            // In a real scenario, you'd make complex calls here.
            // For now, we return mock data just like the simulation, but from a real server.
            console.log(`[REAL BACKEND] Received query: "${query}"`);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockResult: AnalysisResult = {
                trendingChannels: [
                    { name: `AI Insights for ${query}`, subscriberCount: '1.2M', subscriberGrowth: { last7Days: '+15.2K', last30Days: '+60K' }, avgViews: '250K', niche: 'AI & Tech Analysis' },
                    { name: `Future Tech ${query}`, subscriberCount: '450K', subscriberGrowth: { last7Days: '+8.1K', last30Days: '+35K' }, avgViews: '120K', niche: 'Tech News & Speculation' },
                    { name: `Simple AI Demos (${query})`, subscriberCount: '85K', subscriberGrowth: { last7Days: '+12.5K', last30Days: '+45K' }, avgViews: '95K', niche: 'AI Tool Tutorials' }
                ],
                viralVideos: [
                    { title: `This new AI tool for "${query}" will blow your mind!`, channelName: 'AI Insights', views: '2.1M', vph: '3.5K', viralIndex: 95, uploadDate: '3 days ago' },
                    { title: `Is "${query}" the future of everything? An honest review.`, channelName: `Future Tech ${query}`, views: '890K', vph: '1.2K', viralIndex: 88, uploadDate: '1 week ago' },
                    { title: `5 FREE "${query}" tools you can use RIGHT NOW`, channelName: 'Simple AI Demos', views: '1.5M', vph: '2.8K', viralIndex: 92, uploadDate: '5 days ago' }
                ]
            };
            
            res.status(200).json(mockResult);

        } catch (error) {
            console.error('Error in discoverChannels function:', error);
            res.status(500).send(`An internal server error occurred. ${error.message}`);
        }
    });
};
