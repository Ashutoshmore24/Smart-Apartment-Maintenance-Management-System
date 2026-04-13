import React from "react";
import { Link } from "react-router-dom";
import { Building, ShieldCheck, Wrench, ArrowRight, Database, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const LandingPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const features = [
        {
            icon: Wrench,
            title: "Instant Maintenance",
            desc: "Raise and track maintenance requests in real-time with instant notifications.",
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-900/10"
        },
        {
            icon: ShieldCheck,
            title: "Secure Role Access",
            desc: "Advanced RBAC for residents, technicians, and administrators.",
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-900/10"
        },
        {
            icon: Database,
            title: "Structured Data",
            desc: "Integrity and transaction safety powered by robust database architecture.",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/10"
        },
        {
            icon: Building,
            title: "Transparent Billing",
            desc: "Complete visibility into maintenance costs and simplified digital payments.",
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/10"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen transition-colors duration-500 bg-surface-50 dark:bg-surface-950 selection:bg-primary-500/30">
            
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Hero Section */}
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative flex items-center justify-center flex-grow px-6 py-24 lg:py-32"
            >
                <div className="w-full max-w-6xl space-y-12 text-center">

                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary-200/50 dark:border-primary-800/30 text-primary-700 dark:text-primary-300 text-sm font-bold shadow-glow">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        Next-Gen Apartment Management
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-6xl font-[900] leading-[1.1] tracking-tight text-surface-900 dark:text-white sm:text-7xl lg:text-8xl">
                        Smart <span className="gradient-text">Apartment</span> <br />
                        Management
                    </motion.h1>

                    <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-xl leading-relaxed text-surface-600 dark:text-surface-400">
                        A premium digital ecosystem connecting residents, technicians, and administrators. 
                        Experience seamless maintenance tracking and transparent financial management.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col justify-center gap-6 pt-8 sm:flex-row">
                        <Link
                            to="/login"
                            className="group flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all bg-primary-600 rounded-2xl shadow-2xl shadow-primary-500/40 hover:bg-primary-700 active:scale-95"
                        >
                            Resident Login
                            <ArrowRight className="transition-transform group-hover:translate-x-1" size={22} />
                        </Link>

                        <Link
                            to="/register"
                            className="group flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-surface-900 dark:text-white transition-all glass-card border-surface-200 dark:border-surface-800 rounded-2xl hover:border-primary-500/50 active:scale-95"
                        >
                            Create Account
                            <ChevronRight className="transition-transform group-hover:translate-x-1" size={22} />
                        </Link>
                    </motion.div>

                    {/* Dashboard Preview Hint */}
                    <motion.div 
                        variants={itemVariants}
                        className="pt-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
                    >
                        <div className="flex justify-center gap-8 items-center flex-wrap">
                            <span className="font-black text-2xl tracking-tighter italic">RELIABLE</span>
                            <span className="font-black text-2xl tracking-tighter italic underline decoration-primary-500 decoration-4">SECURE</span>
                            <span className="font-black text-2xl tracking-tighter italic">EFFICIENT</span>
                        </div>
                    </motion.div>

                </div>
            </motion.div>

            {/* Features Section */}
            <div className="relative px-6 py-32 bg-surface-100/50 dark:bg-surface-900/30 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface-200 dark:via-surface-800 to-transparent" />
                
                <div className="relative mx-auto text-center max-w-7xl mb-20 space-y-4">
                    <motion.h4 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary-600 dark:text-primary-400 font-black uppercase tracking-[0.2em] text-xs"
                    >
                        Core Features
                    </motion.h4>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-surface-900 dark:text-white lg:text-5xl"
                    >
                        Why Choose SmartStay?
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto text-surface-600 dark:text-surface-400 text-lg"
                    >
                        Engineered with precision to ensure structural integrity, security, and total accountability.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="flex flex-col p-10 glass-card rounded-[2.5rem] border-surface-200 dark:border-surface-800"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-8`}>
                                <f.icon className={`w-7 h-7 ${f.color}`} />
                            </div>
                            <h3 className="mb-4 text-xl font-black text-surface-900 dark:text-white uppercase tracking-tight">
                                {f.title}
                            </h3>
                            <p className="text-surface-600 dark:text-surface-400 leading-relaxed font-medium">
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-surface-200 dark:border-surface-900 bg-white dark:bg-surface-950">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2 text-2xl font-black text-primary-600 dark:text-primary-400">
                        SmartStay
                    </div>
                    <p className="text-surface-400 font-medium">
                        &copy; 2026 SmartStay Systems. Crafted with excellence.
                    </p>
                    <div className="flex gap-6 text-surface-400">
                         <Link to="/about" className="hover:text-primary-500 transition-colors">About</Link>
                         <span className="opacity-20">|</span>
                         <Link to="#" className="hover:text-primary-500 transition-colors">Privacy</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
