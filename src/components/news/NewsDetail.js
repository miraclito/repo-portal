import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Loading from '../common/Loading';
import newsService from '../../services/newsService';
import { toast } from 'react-toastify';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getNewsById(id);
      setNews(response.data);
    } catch (error) {
      toast.error('Error al cargar la noticia');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/800x400?text=Sin+Imagen';
    if (imageUrl.startsWith('http')) return imageUrl;
    return 'http://98.92.158.218:5000' + imageUrl;
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), "d 'de' MMMM, yyyy 'a las' HH:mm", {
        locale: es,
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  if (loading) return <Loading />;
  if (!news) return <div className="container mx-auto px-4 py-8">Noticia no encontrada</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="mb-6">
        <Link to="/" className="text-primary-600 hover:underline">
          Inicio
        </Link>
        {' > '}
        <Link to="/news" className="text-primary-600 hover:underline">
          Noticias
        </Link>
        {' > '}
        <span className="text-gray-600">{news.title}</span>
      </nav>

      <div className="flex items-center justify-between mb-4">
        <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
          {news.category?.name}
        </span>
        <span className="text-gray-500 text-sm">
          {news.views} vistas
        </span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>

      <div className="flex items-center text-gray-600 text-sm mb-6 space-x-4">
        {news.author && (
          <span>Por {news.author.fullName}</span>
        )}
        <span>{formatDate(news.publishedAt || news.createdAt)}</span>
        {news.type === 'scraped' && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            Noticia Agregada
          </span>
        )}
      </div>

      <div className="mb-8">
        <img
          src={getImageUrl(news.imageUrl)}
          alt={news.title}
          className="w-full h-96 object-cover rounded-lg shadow-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=Sin+Imagen';
          }}
        />
      </div>

      {news.summary && (
        <div className="bg-gray-50 border-l-4 border-primary-600 p-4 mb-6">
          <p className="text-lg text-gray-700 italic">{news.summary}</p>
        </div>
      )}

      <div className="prose prose-lg max-w-none mb-8">
        {news.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && (
            <p key={index} className="mb-4 text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          )
        ))}
      </div>

      {news.sourceUrl && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="text-sm text-gray-700">
            <strong>Fuente original: </strong>
            
            <a href={news.sourceUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="text-primary-600 hover:underline break-all"
            >
              {news.sourceUrl}
            </a>
          </div>
        </div>
      )}

      <div className="text-center">
        <Link
       	  to="/news"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition" >
          Volver a Noticias
        </Link>
      </div>
    </div>
  );
};

export default NewsDetail;
