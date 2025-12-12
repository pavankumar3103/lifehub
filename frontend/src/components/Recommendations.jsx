import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations } from '../services/api/analytics';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecommendations();
      if (response.success && response.data) {
        setRecommendations(response.data.recommendations || []);
        setSummary(response.data.summary || '');
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'from-red-500/20 to-orange-500/20 border-red-500/50 text-red-400';
      case 'MEDIUM':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-400';
      case 'LOW':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-400';
      default:
        return 'from-slate-500/20 to-slate-600/20 border-slate-500/50 text-slate-400';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return '🔴 High';
      case 'MEDIUM':
        return '🟡 Medium';
      case 'LOW':
        return '🔵 Low';
      default:
        return priority;
    }
  };

  const getTypeBackground = (type) => {
    const backgrounds = {
      GET_STARTED: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80')",
      REACTIVATE: "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80')",
      DIVERSIFY: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80')",
      FOCUS: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80')",
      EXPAND: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80')",
      REVIEW: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80')",
      COMPLEMENT: "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80')",
      SUGGESTION: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80')",
      ENCOURAGEMENT: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80')",
    };
    return backgrounds[type] || "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80')";
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          <span className="ml-3 text-slate-400">Loading recommendations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
        <div className="text-center py-8">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="text-teal-400 hover:text-teal-300 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💡</span> Recommendations
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-slate-400 text-lg">No recommendations at the moment</p>
          <p className="text-slate-500 text-sm mt-2">Keep tracking your habits to get personalized suggestions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>💡</span> Personalized Recommendations
        </h2>
        <button
          onClick={fetchRecommendations}
          className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
          title="Refresh recommendations"
        >
          🔄 Refresh
        </button>
      </div>

      {summary && (
        <div className="mb-6 p-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-500/20">
          <p className="text-teal-300 text-sm font-medium">{summary}</p>
        </div>
      )}

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${getPriorityColor(rec.priority)} rounded-xl p-5 border backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0 border border-white/20 shadow-lg"
                style={{
                  backgroundImage: getTypeBackground(rec.type)
                }}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-white font-semibold text-lg">
                    {rec.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)} border`}>
                    {getPriorityBadge(rec.priority)}
                  </span>
                </div>
                <p className="text-slate-300 mb-3 leading-relaxed">
                  {rec.description}
                </p>
                {rec.suggestedAction && (
                  <div className="mt-3 pt-3 border-t border-slate-600/30">
                    <p className="text-slate-400 text-sm">
                      <span className="font-medium text-teal-400">💡 Action: </span>
                      {rec.suggestedAction}
                    </p>
                  </div>
                )}
                {rec.type === 'GET_STARTED' || rec.type === 'SUGGESTION' || rec.type === 'COMPLEMENT' ? (
                  <Link
                    to="/habits"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <span>+</span> Add Habit
                  </Link>
                ) : rec.type === 'REACTIVATE' ? (
                  <Link
                    to="/habits"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <span>♻️</span> Review Habits
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <p className="text-slate-500 text-xs text-center">
          Recommendations are personalized based on your current habits and progress
        </p>
      </div>
    </div>
  );
}
