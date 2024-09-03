import axios from 'axios';

const TAVILY_API_BASE_URL = 'https://api.tavily.com';
const TAVILY_API_KEY = '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'; 

interface TavilySearchParams {
  query: string;
  search_depth?: 'basic' | 'advanced';
  topic?: 'general' | 'news';
  max_results?: number;
  include_images?: boolean;
  include_answer?: boolean;
  include_raw_content?: boolean;
}

interface TavilySearchResult {
  answer: string;
  results: Array<{ url: string }>;
}

export async function searchTavily(params: TavilySearchParams): Promise<TavilySearchResult> {
  try {
    const response = await axios.post(`${TAVILY_API_BASE_URL}/search`, {
      api_key: TAVILY_API_KEY,
      ...params
    });

    console.log(response.data);
    const answer = response.data.answer;
    const results = response.data.results.map((result: any) => ({ url: result.url }));

    return { answer, results };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}
