
import React, { useState, useEffect } from 'react';
import { NewsPost } from '../types';
import { b2bService } from '../services/mockApi';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await b2bService.getNews();
      setNews(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Novidades & Comunicados</h1>
        <p className="text-gray-500 mt-2">Mantenha-se informado sobre lançamentos e avisos logísticos para o seu negócio.</p>
      </header>

      {loading ? (
        <div className="space-y-8">
           {[1, 2].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="space-y-12">
           {news.map(post => (
             <article key={post.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
               {post.imageUrl && (
                 <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
               )}
               <div className="p-8">
                 <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase tracking-widest">COMUNICADO</span>
                    <time className="text-xs text-gray-400 font-medium">{new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
                 <p className="text-gray-600 leading-relaxed text-lg">{post.content}</p>
                 
                 <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                    <button className="text-green-600 font-bold hover:underline flex items-center gap-2">
                       Ler mais detalhes
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                    <div className="flex gap-2">
                       <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                       </button>
                    </div>
                 </div>
               </div>
             </article>
           ))}
        </div>
      )}
    </div>
  );
};

export default News;
