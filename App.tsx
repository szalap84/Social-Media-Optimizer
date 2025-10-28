import React, { useState, useCallback, useMemo } from 'react';
import { getYouTubeOptimization, getXOptimization, getFacebookOptimization } from './services/geminiService';
import type { OptimizationResult } from './types';
import Loader from './components/Loader';
import { SparklesIcon, LightBulbIcon, ArrowRightIcon, ShieldCheckIcon, YouTubeIcon, XIcon, FacebookIcon, TagIcon } from './components/Icons';

type Tool = 'youtube' | 'x' | 'facebook';

const TABS_CONFIG = {
    youtube: {
        name: 'YouTube',
        icon: YouTubeIcon,
        header: 'YouTube Title Optimizer',
        subheader: 'Skoryguj tytuł, aby był zgodny z E-E-A-T i maksymalizował zasięgi.',
        label: 'Wpisz roboczy tytuł do analizy',
        placeholder: 'np. Kaczyński znowu atakuje Tuska',
        buttonText: 'Popraw Tytuł',
        resultsHeader: 'Sugerowane Tytuły',
        apiCall: getYouTubeOptimization
    },
    x: {
        name: 'X (Twitter)',
        icon: XIcon,
        header: 'X (Twitter) Post Optimizer',
        subheader: 'Stwórz post, który generuje maksymalne zaangażowanie i zasięgi.',
        label: 'Wpisz temat lub treść posta na X',
        placeholder: 'np. Nowy raport o inflacji w Polsce',
        buttonText: 'Optymalizuj Post',
        resultsHeader: 'Sugerowane Posty',
        apiCall: getXOptimization
    },
    facebook: {
        name: 'Facebook',
        icon: FacebookIcon,
        header: 'Facebook Post Optimizer',
        subheader: 'Zredaguj post, który zachęca do dyskusji i udostępnień.',
        label: 'Wpisz temat lub treść posta na Facebook',
        placeholder: 'np. Dyskusja o nowej ustawie medialnej',
        buttonText: 'Optymalizuj Post',
        resultsHeader: 'Sugerowane Posty',
        apiCall: getFacebookOptimization
    }
};

const Header: React.FC<{ activeTool: Tool }> = ({ activeTool }) => {
    const config = TABS_CONFIG[activeTool];
    return (
        <header className="w-full text-center p-6 border-b border-gray-700">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                {config.header}
            </h1>
            <p className="text-gray-400 mt-2 text-lg">{config.subheader}</p>
        </header>
    );
};

const Tabs: React.FC<{ activeTool: Tool; setActiveTool: (tool: Tool) => void }> = ({ activeTool, setActiveTool }) => (
    <div className="flex justify-center border-b border-gray-700 mb-6">
        {(Object.keys(TABS_CONFIG) as Tool[]).map(tool => {
            const config = TABS_CONFIG[tool];
            const isActive = activeTool === tool;
            const Icon = config.icon;
            return (
                <button
                    key={tool}
                    onClick={() => setActiveTool(tool)}
                    className={`flex items-center px-6 py-3 text-lg font-semibold border-b-4 transition-colors duration-300 ${isActive ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                >
                    <Icon className="w-6 h-6 mr-2" />
                    {config.name}
                </button>
            );
        })}
    </div>
);


interface InputFormProps {
    onSubmit: (userInput: string) => void;
    isLoading: boolean;
    activeTool: Tool;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, activeTool }) => {
    const [userInput, setUserInput] = useState('');
    const config = TABS_CONFIG[activeTool];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInput.trim()) {
            onSubmit(userInput.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center p-4 space-y-4">
             <div className="w-full max-w-2xl">
                <label htmlFor="user-input" className="block text-sm font-medium text-gray-300 mb-2">
                    {config.label}
                </label>
                <textarea
                    id="user-input"
                    key={activeTool} // Force re-render on tab change to clear state
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full h-28 p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-300"
                    disabled={isLoading}
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center"
            >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Analizowanie...' : config.buttonText}
            </button>
        </form>
    );
};

interface ResultDisplayProps {
    result: OptimizationResult | null;
    error: string | null;
    isLoading: boolean;
    hasAnalyzed: boolean;
    activeTool: Tool;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error, isLoading, hasAnalyzed, activeTool }) => {
    const config = TABS_CONFIG[activeTool];
    
    if (isLoading) return <Loader />;
    if (error) return <div className="text-red-400 bg-red-900/50 p-4 rounded-lg max-w-3xl mx-auto my-4">{error}</div>;
    
    if (!hasAnalyzed) {
        return (
             <div className="text-center text-gray-400 mt-8 max-w-xl mx-auto">
                <LightBulbIcon className="w-12 h-12 mx-auto text-yellow-400" />
                <h3 className="text-2xl font-semibold text-white mt-4">Gotowy do optymalizacji?</h3>
                <p className="mt-2">Wpisz swoją treść. Przeanalizuję ją pod kątem najlepszych praktyk dla wybranej platformy i zaproponuję poprawki.</p>
            </div>
        )
    }

    if (!result) return null;

    return (
        <div className="w-full max-w-4xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="w-full">
                <h2 className="text-2xl font-bold text-center text-white mb-4">Kluczowe Wskazówki</h2>
                <div className="space-y-4">
                    {result.guidelines.map((guideline, index) => (
                        <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow-lg">
                            <h3 className="text-lg font-semibold text-yellow-300 flex items-start">
                                <ShieldCheckIcon className="w-6 h-6 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                                <span>{guideline.title}</span>
                            </h3>
                            <p className="text-gray-300 mt-2 pl-9 text-sm">{guideline.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full">
                <h2 className="text-2xl font-bold text-center text-white mb-4">{config.resultsHeader}</h2>
                <div className="space-y-4">
                    {result.suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow-lg transition-transform transform hover:scale-[1.02] hover:border-blue-500">
                            <h3 className="text-xl font-semibold text-teal-300 flex items-start">
                                <ArrowRightIcon className="w-6 h-6 mr-3 mt-1 text-teal-400 flex-shrink-0" />
                                <span className="whitespace-pre-wrap">{suggestion.content}</span>
                            </h3>
                            <p className="text-gray-300 mt-2 pl-9">{suggestion.reason}</p>
                        </div>
                    ))}
                </div>
                {activeTool === 'youtube' && result.tags && result.tags.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-center text-white mb-4 flex items-center justify-center">
                           <TagIcon className="w-6 h-6 mr-2" />
                           Sugerowane Tagi
                        </h2>
                        <div className="flex flex-wrap justify-center gap-2 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                            {result.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-700 text-teal-300 text-sm font-medium px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default function App() {
    const [activeTool, setActiveTool] = useState<Tool>('youtube');
    const [results, setResults] = useState<Record<Tool, OptimizationResult | null>>({ youtube: null, x: null, facebook: null });
    const [loading, setLoading] = useState<Record<Tool, boolean>>({ youtube: false, x: false, facebook: false });
    const [errors, setErrors] = useState<Record<Tool, string | null>>({ youtube: null, x: null, facebook: null });
    const [hasAnalyzed, setHasAnalyzed] = useState<Record<Tool, boolean>>({ youtube: false, x: false, facebook: false });

    const handleAnalyze = useCallback(async (userInput: string) => {
        setLoading(prev => ({ ...prev, [activeTool]: true }));
        setErrors(prev => ({ ...prev, [activeTool]: null }));
        setHasAnalyzed(prev => ({ ...prev, [activeTool]: true }));
        setResults(prev => ({ ...prev, [activeTool]: null }));

        try {
            const apiCall = TABS_CONFIG[activeTool].apiCall;
            const analysisResult = await apiCall(userInput);
            setResults(prev => ({...prev, [activeTool]: analysisResult}));
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Wystąpił nieznany błąd.";
            setErrors(prev => ({...prev, [activeTool]: `Błąd analizy: ${errorMessage}`}));
        } finally {
            setLoading(prev => ({ ...prev, [activeTool]: false }));
        }
    }, [activeTool]);
    
    const currentResult = useMemo(() => results[activeTool], [results, activeTool]);
    const currentIsLoading = useMemo(() => loading[activeTool], [loading, activeTool]);
    const currentError = useMemo(() => errors[activeTool], [errors, activeTool]);
    const currentHasAnalyzed = useMemo(() => hasAnalyzed[activeTool], [hasAnalyzed, activeTool]);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <main className="container mx-auto px-4 py-8">
                <Header activeTool={activeTool} />
                <Tabs activeTool={activeTool} setActiveTool={setActiveTool} />
                <InputForm onSubmit={handleAnalyze} isLoading={currentIsLoading} activeTool={activeTool} />
                <ResultDisplay result={currentResult} error={currentError} isLoading={currentIsLoading} hasAnalyzed={currentHasAnalyzed} activeTool={activeTool} />
            </main>
        </div>
    );
}
