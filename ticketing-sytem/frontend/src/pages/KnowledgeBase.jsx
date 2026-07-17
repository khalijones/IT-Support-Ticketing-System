import React, { useEffect, useState } from 'react';
import api from '../services/api';

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/knowledge-base');
      setArticles(response.data);
    };
    load();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article._id} className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-gray-600 mt-2">{article.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
