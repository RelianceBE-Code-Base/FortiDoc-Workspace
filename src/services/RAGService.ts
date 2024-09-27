import axios from 'axios';

const API_URL = 'https://digital-workspace-rag-backend.azurewebsites.net'

const RAGService = {
  uploadDocuments: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  },

  queryRAGSystem: async (query: string) => {
    try {
      const formData = new FormData();
      formData.append('query', query);

      const response = await axios.post(`${API_URL}/query`, formData);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error querying RAG system:', error);
      throw error;
    }
  }
};

export default RAGService;