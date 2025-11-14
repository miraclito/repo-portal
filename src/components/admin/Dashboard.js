import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../../services/newsService';
import categoryService from '../../services/categoryService';
import scraperService from '../../services/scraperService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalNews: 0,
    totalCategories: 0,
    scrapedNews: 0,
    originalNews: 0,
  });
 // const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    try {
      setLoading(true);
      const [newsResponse, categoriesResponse, scraperStats] = await Promise.all([
        newsService.getAllNews({ limit: 1 }),
        categoryService.getAllCategories(),
        scraperService.getStats(),
      ]);

      setStats({
        totalNews: newsResponse.data.pagination.total,
        totalCategories: categoriesResponse.data.length,
        scrapedNews: scraperStats.data.totalScraped,
        originalNews: scraperStats.data.totalOriginal,
      });
    } catch (error) {
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleRunScraping = async () => {
    try {
      setScraping(true);
      toast.info('Iniciando scraping... Esto puede tomar un momento');
      const response = await scraperService.runScraping();
      toast.success(`Scraping completado: ${response.data.newsScraped} noticias nuevas`);
      fetchStats(); // Actualizar estadísticas
    } catch (error) {
      toast.error('Error al ejecutar scraping');
    } finally {
      setScraping(false);
    }
  };
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando estadísticas...</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Panel de Administración
      </h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <span className="text-3xl">📰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Noticias</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <span className="text-3xl">✍️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Noticias Propias</p>
              <p className="text-2xl font-bold text-gray-900">{stats.originalNews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <span className="text-3xl">🕷️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Noticias Scrapeadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scrapedNews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <span className="text-3xl">📂</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/news/create"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center">
            <span className="text-4xl mr-4">➕</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crear Noticia</h3>
              <p className="text-sm text-gray-500">Agregar nueva noticia manualmente</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/news"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center">
            <span className="text-4xl mr-4">📝</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestionar Noticias</h3>
              <p className="text-sm text-gray-500">Ver y editar todas las noticias</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center">
            <span className="text-4xl mr-4">📂</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestionar Categorías</h3>
              <p className="text-sm text-gray-500">Administrar categorías de noticias</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Scraping */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Web Scraping</h2>
        <p className="text-gray-600 mb-4">
          Ejecuta el scraping manualmente para obtener las últimas noticias de fuentes externas.
        </p>
        <button
          onClick={handleRunScraping}
          disabled={scraping}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {scraping ? '🕷️ Scraping en proceso...' : '🕷️ Ejecutar Scraping Ahora'}
        </button>
      </div>
       {/* Exportar CSV */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Exportar Datos</h2>
        <p className="text-gray-600 mb-4">
          Descarga todas las noticias en formato CSV para análisis externo.
        </p>
        <div className="flex space-x-4">
          
          <a href="http://3.227.208.152:5000/api/export/news/csv"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition inline-block"
          >
            📊 Descargar Noticias (CSV)
          </a>
          
          <a href="http://3.227.208.152:5000/api/export/stats/csv"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition inline-block"
          >
            📈 Descargar Estadísticas (CSV)
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
