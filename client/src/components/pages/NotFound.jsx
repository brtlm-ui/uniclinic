import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[60%] bg-secondary-container/20 rounded-full blur-3xl -z-10"></div>

            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-primary-container/30 flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '3rem' }}>
                    search_off
                </span>
            </div>

            {/* 404 heading */}
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">Error 404</p>
            <h1 className="font-headline text-6xl md:text-8xl font-extrabold text-on-surface tracking-tighter mb-4">
                Page Not Found
            </h1>
            <p className="text-lg text-on-surface-variant max-w-md text-center leading-relaxed mb-10">
                The page you're looking for doesn't exist or has been moved. Please check the URL or head back to the dashboard.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dim hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;
