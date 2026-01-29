import { useState, useEffect } from "react";
import BotCard from "./bot-card/botCard";
import { db } from "../../firebase";
import { collection, getDocs, query } from "firebase/firestore";

function Product({ isLanding }) {
    const [bots, setBots] = useState([]);
    const [loadingBots, setLoadingBots] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isGridView, setIsGridView] = useState(true);

    useEffect(() => {
        const getBots = async () => {
            try {
                const botsRef = collection(db, 'bots');
                const q = query(botsRef);
                const snapshot = await getDocs(q);

                const botsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setBots(botsList);
                setLoadingBots(false);
            } catch (error) {
                console.error("Error fetching bots: ", error);
            }
        };

        getBots();
    }, []);

    const displayedBots = isLanding ? bots.slice(0, 8) : bots;

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
            {/* Ambient background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        {/* Title Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                                <span className="text-purple-400 text-sm font-semibold uppercase tracking-[0.2em]">
                                    {isLanding ? 'Featured Collection' : 'Full Catalog'}
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                                {isLanding ? (
                                    <>
                                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Legends</span>
                                    </>
                                ) : (
                                    <>
                                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">History</span>
                                    </>
                                )}
                            </h2>
                            <p className="text-gray-400 text-lg max-w-2xl">
                                {isLanding 
                                    ? 'Discover the minds that shaped our world. Start your journey through time.'
                                    : `Browse ${bots.length} historical figures and engage in conversations that transcend time.`
                                }
                            </p>
                        </div>

                        {/* Controls - Only show in full access mode */}
                        {!isLanding && (
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* View Toggle */}
                                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-1">
                                    <button
                                        onClick={() => setIsGridView(true)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                            isGridView
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setIsGridView(false)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                            !isGridView
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 4h18v3H3V4zm0 7h18v3H3v-3zm0 7h18v3H3v-3z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Filter Dropdown */}
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white font-medium cursor-pointer hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="all" className="bg-gray-900">All Figures</option>
                                    <option value="science" className="bg-gray-900">Scientists</option>
                                    <option value="philosophy" className="bg-gray-900">Philosophers</option>
                                    <option value="leaders" className="bg-gray-900">Leaders</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loadingBots ? (
                    <div className="max-w-7xl mx-auto">
                        <div className={`grid gap-6 ${
                            isLanding 
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        }`}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl"
                                    style={{
                                        animation: `shimmer 2s ease-in-out ${index * 0.1}s infinite`
                                    }}
                                >
                                    {/* Card skeleton */}
                                    <div className="aspect-[3/4] p-6 flex flex-col justify-between">
                                        {/* Image placeholder */}
                                        <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mb-4 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer-effect" />
                                        </div>
                                        
                                        {/* Text placeholders */}
                                        <div className="space-y-3">
                                            <div className="h-6 bg-white/10 rounded-lg w-3/4" />
                                            <div className="h-4 bg-white/5 rounded w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        {/* Grid/List View */}
                        <div className={`
                            ${isGridView 
                                ? `grid gap-6 ${
                                    isLanding 
                                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                }`
                                : 'flex flex-col gap-4'
                            }
                        `}>
                            {displayedBots.map((bot, index) => (
                                <div
                                    key={bot.id}
                                    className="transform transition-all duration-500 hover:scale-[1.02]"
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                                    }}
                                >
                                    <BotCard person={bot} index={index} />
                                </div>
                            ))}
                        </div>

                        {/* Show More CTA for Landing Page */}
                        {isLanding && bots.length > 8 && (
                            <div className="mt-16 flex flex-col items-center gap-6">
                                <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                                <div className="text-center space-y-4">
                                    <p className="text-gray-400 text-lg">
                                        Discover <span className="text-white font-bold">dozens of more</span> historical figures
                                    </p>
                                    <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70 hover:scale-105 overflow-hidden">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Explore Full Collection
                                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                                                →
                                            </span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Stats Bar for Full Access */}
                        {!isLanding && (
                            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Figures', value: bots.length, icon: '👥' },
                                    { label: 'Categories', value: '12+', icon: '📚' },
                                    { label: 'Conversations', value: '50K+', icon: '💬' },
                                    { label: 'Avg Rating', value: '4.9/5', icon: '⭐' }
                                ].map((stat, index) => (
                                    <div
                                        key={stat.label}
                                        className="group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
                                        style={{
                                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                        }}
                                    >
                                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                            {stat.icon}
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0%, 100% {
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .shimmer-effect {
                    animation: shimmerSlide 2s ease-in-out infinite;
                }

                @keyframes shimmerSlide {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.1;
                    }
                    50% {
                        opacity: 0.2;
                    }
                }
            `}</style>
        </div>
    );
}

export default Product;