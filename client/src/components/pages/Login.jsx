import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { config, endpoints } from '../config/config';

const cookies = new Cookies();

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${config.uniClinicAPI}${endpoints.staff}/login`, { username, password });
            const { token, data } = response.data;
            cookies.set('TOKEN', token, { path: '/', maxAge: 86400 });
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-xl bg-white/40">
                <div className="text-2xl font-black font-headline text-primary tracking-tight">
                    UniClinic
                </div>
                <div className="hidden md:flex items-center gap-2 text-on-surface-variant font-medium text-sm">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                    <span>Secure Medical Environment</span>
                </div>
            </header>
            <main className="min-h-screen flex items-center justify-center pt-20 px-6">
                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '\'FILL\' 1' }}>health_and_safety</span>
                            Clinical Serenity
                        </div>
                        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tighter">
                            Streamlining <br />
                            <span className="text-primary-dim">Student Wellness.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-on-surface-variant max-w-md leading-relaxed">
                            Access the clinical dashboard to manage student visits, medications, and treatments with high-end precision and care.
                        </p>
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-4">
                                <img className="w-12 h-12 rounded-full border-4 border-surface object-cover" data-alt="Close-up portrait of a professional female doctor in a white coat smiling confidently against a soft blurred clinic background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkzDV9zZwmzpoXLhRVahAPPWsVmE2Wit1T7Nn7Ov4CiQtsN4TyiLs3EWGfZMufk4tder93NZW8WRAED4rrsUkq5DmoNKbxFfIQgWlhxtK908eFgrGUI_qhKhc8ptpIYvYgoCBzmiyL9flBIgOdm0d4f63jsLiS98QaEh5rSPScrjaU2v8MGYENMXbjiQoBSOkmSEajHx3AaT4IbaNKrHfRDW4OhJAvfvM5BlNqC86qLqu-Z8ocACwDTM0UUAYVeSsP-2KCNwbbQVc" />
                                <img className="w-12 h-12 rounded-full border-4 border-surface object-cover" data-alt="Close-up portrait of a professional male physician wearing glasses and scrubs looking helpful and calm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFoTCTYB6NcMTfIeHgIW5gA6Nb6sWgb6m65oFTG7fB9HZLLlvvdqDa2mBx7qwQsOvUD9OsXETOziYFmxZ0WbPnsE-8BZcNCnDEqsVmgn_6JKsG015nfnmpmojKP6hYQLvrvz465qqxVDD9ycGW-naMZbXeXvA0DA3ZDi5I-7ALEeF5PQyCQ_Y19EKYDEm6iyJ30QCbQigBa1rNS8qE8A89S0PxB0PObAlfydKiNzbUojiREdExsyj_j-pBcxK8WKe_ZNeroEGu7aU" />
                                <img className="w-12 h-12 rounded-full border-4 border-surface object-cover" data-alt="Young professional nurse with a stethoscope around her neck smiling in a bright airy medical office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYxHxIvgJIGXRyQaHgoTqg910COweVqxDu_nIetBgl_RBRD12J75WCWPHI--4-53VgHvuJcgSJAAACKhwqgvs4DvAyEo2CntzfyusvjhMOwv_1qsPrQNk7lJN4LQK3bR7QluY1RE1WwYsr32eEQEtsfnqtTaJeGPssefxw478ho3hBQ5ZwpLEVZp_apZExek_DQ6O1O9x_1iP57LygS3TNhejbKzgmNYzovW82Y7lGWi3cZr_cSfNGxcZZ1VJTSme-1nYuoPiICWY" />
                            </div>
                            <span className="text-sm font-medium text-on-surface-variant">Trusted by 200+ School Districts</span>
                        </div>
                    </div>

                    <div className="relative flex justify-center">

                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
                        <div className="w-full max-w-md bg-surface-container-lowest p-10 md:p-14 rounded-xl soft-shadow border border-outline-variant/10">
                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
                                <p className="text-on-surface-variant font-medium">Please enter your credentials to proceed.</p>
                            </div>
                            <form action="#" className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-on-surface-variant ml-2 uppercase tracking-wide" htmlFor="username">Username</label>
                                    <div className="relative flex items-center group ghost-border rounded-lg transition-all duration-300">
                                        <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">person</span>
                                        <input 
                                            className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-lg text-on-surface placeholder:text-outline-variant focus:ring-0 focus:bg-surface-container-lowest transition-all" 
                                            id="username" placeholder="nurse.miller" 
                                            type="text" 
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-on-surface-variant ml-2 uppercase tracking-wide" htmlFor="password">Password</label>
                                    <div className="relative flex items-center group ghost-border rounded-lg transition-all duration-300">
                                        <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                                        <input 
                                            className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-lg text-on-surface placeholder:text-outline-variant focus:ring-0 focus:bg-surface-container-lowest transition-all" 
                                            id="password" 
                                            placeholder="••••••••" 
                                            type={showPassword ? 'text' : 'password'} 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button className="absolute right-4 text-outline-variant hover:text-primary transition-colors" type="button" onClick={() => setShowPassword(prev => !prev)}>
                                            <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
                                        <span className="text-sm font-medium text-on-surface-variant">Remember me</span>
                                    </label>
                                    <a className="text-sm font-bold text-primary hover:text-primary-dim transition-colors" href="#">Forgot Password?</a>
                                </div>
                                {error && (
                                    <p className="text-sm text-red-500 font-medium text-center -mb-2">{error}</p>
                                )}
                                <button 
                                    className="w-full py-5 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dim hover:scale-[1.02] active:scale-95 transition-all duration-200 mt-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" 
                                    type="submit"
                                    onClick={(e) => handleLogin(e)}
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Access Dashboard'}
                                    {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                                </button>
                            </form>
                            <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
                                <p className="text-sm text-on-surface-variant font-medium">
                                    Need technical assistance?
                                    <a className="text-primary font-bold hover:underline" href="#">Contact Health Concierge</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 w-full h-1/2 pointer-events-none -z-20 overflow-hidden">
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-full bg-secondary-container/10 rounded-full blur-3xl transform rotate-12"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-full bg-primary-container/10 rounded-full blur-3xl transform -rotate-12"></div>
            </div>

        </>
    );
};

export default Login;
