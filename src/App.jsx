import { useState, useRef, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Users, Megaphone, TrendingUp, Mail, Briefcase, Star, Sparkles, Youtube } from 'lucide-react'
import { ThemeToggle } from "./components/ThemeToggle"
import { AnimatedDiv } from "./components/AnimatedDiv"
import { ThemeProvider } from "./components/ThemeProvider"
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from "react-toastify"
import exclusiveTalents from "../talents.json";
import brands from "../brands.json";
// Mock data for exclusive talents

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

function App() {
    const [formType, setFormType] = useState("influencer")
    const scrollContainerRef = useRef(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [socialLink, setSocialLink] = useState("");
    const [niche, setNiche] = useState("");
    const [message, setMessage] = useState("");
    const [contact, setContact] = useState("");
    const [website, setWebsite] = useState("");
    const [budget, setBudget] = useState("");
    const captchaRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [captchaLoading, setCaptchaLoading] = useState(false);


    const handleCaptcha = (token) => {
        setCaptchaLoading(false);
    };


    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer) return

        let scrollAmount = 0
        const scrollSpeed = 0.5
        const intervalTime = 20

        let scrollInterval

        const startScrolling = () => {
            scrollInterval = setInterval(() => {
                scrollAmount += scrollSpeed
                if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
                    scrollAmount = 0
                }
                scrollContainer.scrollLeft = scrollAmount
            }, intervalTime)
        }

        const stopScrolling = () => {
            clearInterval(scrollInterval)
        }

        startScrolling()

        scrollContainer.addEventListener("mouseenter", stopScrolling)
        scrollContainer.addEventListener("mouseleave", startScrolling)

        return () => {
            stopScrolling()
            scrollContainer.removeEventListener("mouseenter", stopScrolling)
            scrollContainer.removeEventListener("mouseleave", startScrolling)
        }
    }, [])



    const handleSubmit = async (e) => {
        console.log("Form submitted:", {
            name,
            email,
            socialLink,
            niche,
            message,
            contact,
            website,
            budget,
        });
        try {
            e.preventDefault();
            setCaptchaLoading(true);
            const token = await captchaRef.current?.executeAsync();
            captchaRef.current?.reset();
            setCaptchaLoading(false);
            setLoading(true);
            console.log("reCAPTCHA token:", token);
            if (!token) {
                alert("Por favor completá el reCAPTCHA");
                return;
            }
            const urlBase = `${API_URL}/api/mailer/forms/`;
            console.log(urlBase)

            if (formType === 'influencer') {
                const response = await fetch(`${urlBase}influencer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            name,
                            email,
                            socialLink,
                            niche,
                            message,
                            recaptchaToken: token,
                        }
                    }),
                })
                if (response.status === 200) {
                    setName("");
                    setEmail("");
                    setSocialLink("");
                    setNiche("");
                    setMessage("");
                    toast.success('¡Formulario enviado!');
                    setLoading(false);
                }
                // const data = response.data;
            }
            if (formType === 'brand') {
                const response = await fetch(`${urlBase}brand`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            name,
                            email,
                            contact,
                            website,
                            budget,
                            message,
                            recaptchaToken: token,
                        }
                    }),
                })
                if (response.status === 200) {
                    setName("");
                    setEmail("");
                    setContact("");
                    setWebsite("");
                    setBudget("");
                    setMessage("");
                    toast.success('¡Formulario enviado!');
                    setLoading(false);
                }
                // const data = response.data;
            } if (formType === 'other') {
                const response = await fetch(`${urlBase}other`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            name,
                            email,
                            message,
                            recaptchaToken: token,
                        }
                    }),
                })
                if (response.status === 200) {
                    setName("");
                    setEmail("");
                    setMessage("");
                    toast.success('¡Formulario enviado!');
                    setLoading(false);
                }
                // const data = response.data;
            }
        } catch (error) {
            console.log(error);
            toast.error('Error al enviar el formulario. Por favor, intentá nuevamente más tarde.');
            setLoading(false)
        }
    }

    const handleLinkClick = (e, href) => {
        e.preventDefault()
        if (href.startsWith('#')) {
            const element = document.querySelector(href)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        } else {
            window.open(href, '_blank')
        }
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="newline-theme">
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                {/* Header */}
                <header className="px-4 lg:px-8 h-16 flex items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                    <a href="#" className="flex items-center gap-2 font-bold text-xl text-primary" onClick={(e) => handleLinkClick(e, '#')}>
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span>Newline</span>
                    </a>
                    <nav className="hidden md:flex gap-8">
                        <a href="#services" className="text-sm font-medium hover:text-primary transition-colors" onClick={(e) => handleLinkClick(e, '#services')}>
                            Services
                        </a>
                        <a href="#talents" className="text-sm font-medium hover:text-primary transition-colors" onClick={(e) => handleLinkClick(e, '#talents')}>
                            Talents
                        </a>
                        <a href="#clients" className="text-sm font-medium hover:text-primary transition-colors" onClick={(e) => handleLinkClick(e, '#clients')}>
                            Clients
                        </a>
                        <a href="#about" className="text-sm font-medium hover:text-primary transition-colors" onClick={(e) => handleLinkClick(e, '#about')}>
                            About Us
                        </a>
                        <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors" onClick={(e) => handleLinkClick(e, '#contact')}>
                            Contact
                        </a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <Button className="hidden md:inline-flex text-black" onClick={(e) => handleLinkClick(e, '#contact')}>
                            Join Us
                        </Button>
                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="w-full py-24 md:py-36 lg:py-48 xl:py-60 bg-gradient-to-br from-background via-secondary/10 to-primary/10 relative overflow-hidden">
                        {/* Floating elements */}
                        <div className="absolute top-1/4 left-[10%] w-48 h-48 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-y-slow z-0"></div>
                        <div className="absolute bottom-1/4 right-[15%] w-64 h-64 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-x-slow z-0"></div>
                        <div className="absolute top-[20%] right-[5%] w-32 h-32 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-y-slow z-0"></div>
                        <div className="absolute bottom-[10%] left-[5%] w-56 h-56 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-x-slow z-0"></div>

                        <div className="container px-4 md:px-6 text-center relative z-10 mx-auto max-w-7xl">
                            <div className="max-w-4xl mx-auto space-y-10">
                                <AnimatedDiv delay={0}>
                                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-balance drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                        Unleash Your Potential. Define the Future.
                                    </h1>
                                </AnimatedDiv>
                                <AnimatedDiv delay={200}>
                                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-md">
                                        We're Newline: the audacious architects of influence. We don't just connect brands with creators; we
                                        forge legendary partnerships that ignite movements and reshape digital culture.
                                    </p>
                                </AnimatedDiv>
                                <AnimatedDiv delay={400}>
                                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                                        <Button
                                            size="lg"
                                            className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground text-black"
                                            onClick={(e) => handleLinkClick(e, '#contact')}
                                        >
                                            Ignite Your Campaign Now!
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="px-8 py-3 text-lg border-2 border-primary/50 hover:border-primary transition-all duration-300 bg-transparent text-foreground hover:text-primary"
                                            onClick={(e) => handleLinkClick(e, '#services')}
                                        >
                                            Explore Our Craft
                                        </Button>
                                    </div>
                                </AnimatedDiv>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section id="services" className="w-full py-20 md:py-32 lg:py-40 bg-background">
                        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                            <AnimatedDiv delay={0}>
                                <div className="text-center space-y-8 mb-20">
                                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                                        Our Limitless Capabilities
                                    </h2>
                                    <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed">
                                        Beyond conventional marketing, we sculpt bespoke strategies and unleash creative firepower to make
                                        your brand unforgettable.
                                    </p>
                                </div>
                            </AnimatedDiv>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-center h-full">
                                <AnimatedDiv delay={100}>
                                    <div className="group h-full bg-card p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/20 hover:border-primary/80 transform hover:-translate-y-2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="relative p-4 rounded-full bg-gradient-to-br from-primary to-primary/50 shadow-xl group-hover:from-primary/90 group-hover:to-primary/70 transition-all duration-300">
                                                    <Users className="h-10 w-10 text-primary-foreground drop-shadow-[0_0_8px_rgba(0,255,255,0.7)] group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-2xl font-semibold">Influencer Nexus</h3>
                                            </div>
                                            <p className="text-muted-foreground text-lg flex-grow">
                                                We curate and connect with the most impactful voices, ensuring authentic synergy and unparalleled
                                                reach for your brand story.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedDiv>
                                <AnimatedDiv delay={200}>
                                    <div className="group h-full bg-card p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-secondary/20 hover:border-secondary/80 transform hover:-translate-y-2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="relative p-4 rounded-full bg-gradient-to-br from-secondary to-secondary/50 shadow-xl group-hover:from-secondary/90 group-hover:to-secondary/70 transition-all duration-300">
                                                    <Megaphone className="h-10 w-10 text-secondary-foreground drop-shadow-[0_0_8px_rgba(0,229,255,0.7)] group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-2xl font-semibold">Impactful Campaigns</h3>
                                            </div>
                                            <p className="text-muted-foreground text-lg flex-grow">
                                                From concept to conversion, we meticulously craft and execute campaigns that resonate deeply,
                                                leaving a lasting impression and measurable results.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedDiv>
                                <AnimatedDiv delay={300}>
                                    <div className="group h-full bg-card p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-accent/20 hover:border-accent/80 transform hover:-translate-y-2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="relative p-4 rounded-full bg-gradient-to-br from-accent to-accent/50 shadow-xl group-hover:from-accent/90 group-hover:to-accent/70 transition-all duration-300">
                                                    <TrendingUp className="h-10 w-10 text-accent-foreground drop-shadow-[0_0_8px_rgba(255,12,206,0.7)] group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-2xl font-semibold">Data-Driven Evolution</h3>
                                            </div>
                                            <p className="text-muted-foreground text-lg flex-grow">
                                                We dissect data to uncover insights, constantly optimizing strategies for peak performance and
                                                ensuring your next move is always your best.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedDiv>
                                <AnimatedDiv delay={400}>
                                    <div className="group h-full bg-card p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/20 hover:border-primary/80 transform hover:-translate-y-2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="relative p-4 rounded-full bg-gradient-to-br from-primary to-primary/50 shadow-xl group-hover:from-primary/90 group-hover:to-primary/70 transition-all duration-300">
                                                    <Star className="h-10 w-10 text-primary-foreground drop-shadow-[0_0_8px_rgba(0,255,255,0.7)] group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-2xl font-semibold">Narrative Crafting</h3>
                                            </div>
                                            <p className="text-muted-foreground text-lg flex-grow">
                                                We collaborate with creators to sculpt compelling narratives that captivate, ensuring every piece
                                                of content is a viral sensation in the making.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedDiv>
                                <AnimatedDiv delay={500}>
                                    <div className="group h-full bg-card p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-secondary/20 hover:border-secondary/80 transform hover:-translate-y-2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="relative p-4 rounded-full bg-gradient-to-br from-secondary to-secondary/50 shadow-xl group-hover:from-secondary/90 group-hover:to-secondary/70 transition-all duration-300">
                                                    <Briefcase className="h-10 w-10 text-secondary-foreground drop-shadow-[0_0_8px_rgba(0,229,255,0.7)] group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-2xl font-semibold">Strategic Alliances</h3>
                                            </div>
                                            <p className="text-muted-foreground text-lg flex-grow">
                                                We forge enduring bonds, transforming one-off campaigns into powerful, long-term partnerships that
                                                drive continuous brand evolution.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedDiv>
                                <AnimatedDiv delay={600}>
                                    <div className="group h-full bg-card p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-accent/20 hover:border-accent/80 transform hover:-translate-y-2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="relative p-4 rounded-full bg-gradient-to-br from-accent to-accent/50 shadow-xl group-hover:from-accent/90 group-hover:to-accent/70 transition-all duration-300">
                                                    <Mail className="h-10 w-10 text-accent-foreground drop-shadow-[0_0_8px_rgba(255,12,206,0.7)] group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-2xl font-semibold">Curated Outreach</h3>
                                            </div>
                                            <p className="text-muted-foreground text-lg flex-grow">
                                                Our personalized approach ensures every connection is meaningful, setting the stage for
                                                high-impact collaborations from the first touch.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedDiv>
                            </div>
                        </div>
                    </section>

                    {/* Exclusive Talents Section */}
                    <section id="talents" className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-muted/40">
                        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                            <AnimatedDiv delay={0}>
                                <div className="text-center space-y-8 mb-20">
                                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-secondary">
                                        Meet Our Visionary Talents
                                    </h2>
                                    <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed">
                                        These are the groundbreaking creators exclusively partnered with Newline, shaping trends and
                                        captivating millions worldwide.
                                    </p>
                                </div>
                            </AnimatedDiv>
                            <AnimatedDiv delay={200}>
                                <div
                                    ref={scrollContainerRef}
                                    className="flex overflow-x-auto whitespace-nowrap scrollbar-hide py-6 px-2 -mx-2"
                                >
                                    {exclusiveTalents.map((talent) => (
                                        <a
                                            key={talent.id}
                                            href={talent.youtubeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block w-[280px] flex-shrink-0 mx-4 group"
                                        >
                                            <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/50 transform hover:-translate-y-2 flex flex-col items-center text-center h-full">
                                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/50 group-hover:border-primary transition-colors duration-300 mb-4">
                                                    <img
                                                        src={talent.imageUrl || "/placeholder.svg"}
                                                        alt={`${talent.userName} channel avatar`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                                    {talent.userName}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-3">{talent.subscribers} Subscribers</p>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="mt-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                                >
                                                    <Youtube className="h-4 w-4 mr-2" /> View Channel
                                                </Button>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </AnimatedDiv>
                        </div>
                    </section>

                    {/* Clients Section */}
                    <section id="clients" className="w-full py-20 md:py-32 lg:py-40 bg-muted/40">
                        <div className="container px-4 md:px-6 text-center mx-auto max-w-7xl">
                            <AnimatedDiv delay={0}>
                                <div className="space-y-8 mb-20">
                                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                                        Our Esteemed Collaborators
                                    </h2>
                                    <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
                                        We proudly partner with leading brands who trust Newline to elevate their presence and captivate
                                        global audiences.
                                    </p>
                                </div>
                            </AnimatedDiv>
                            <AnimatedDiv delay={200}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-10 gap-y-14 items-center justify-center">
                                    {brands.map((brand, index) => (
                                        <div>

                                            <img
                                                key={index}
                                                src={`${brand.logo}`}
                                                width="140"
                                                height="70"
                                                alt={`${brand.name} Logo`}
                                                className="aspect-[2/1] object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
                                            />
                                            <h4>{brand.name}</h4>
                                        </div>
                                    ))}
                                </div>
                            </AnimatedDiv>
                        </div>
                    </section>

                    {/* About Us Section */}
                    <section id="about" className="w-full py-20 md:py-32 lg:py-40 bg-background">
                        <div className="container px-4 md:px-6 flex justify-center mx-auto max-w-7xl">
                            <AnimatedDiv delay={0}>
                                <div className="space-y-10 relative max-w-2xl text-center">
                                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-secondary">
                                        Where Creativity Ignites Impact
                                    </h2>
                                    {/* Floating PNG graphic placeholder */}
                                    <div className="absolute -top-10 right-0 md:-right-10 w-24 h-24 md:w-32 md:h-32 animate-float-y-slow z-10 opacity-80 bg-primary/20 rounded-full"></div>
                                    <p className="text-muted-foreground md:text-lg leading-relaxed">
                                        At Newline, we are pioneers of the digital frontier, merging cutting-edge strategy with raw creative
                                        power. We're a collective of passionate storytellers, analytical strategists, and visionary designers
                                        obsessed with crafting campaigns that don't just perform—they inspire, engage, and define cultural
                                        moments.
                                    </p>
                                    <p className="text-muted-foreground md:text-lg leading-relaxed">
                                        Our mission is to unlock unparalleled influence for brands and amplify the authentic voices of
                                        creators. We thrive on audacious ideas, transparent collaborations, and relentless pursuit of
                                        measurable, awe-inspiring results. Join us, and let's sculpt the next viral sensation.
                                    </p>
                                </div>
                            </AnimatedDiv>
                            {/* <AnimatedDiv delay={200}>
                                <div className="relative h-[350px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src="https://via.placeholder.com/800x600?text=Creative+Agency+Team"
                                        alt="Creative agency team collaborating"
                                        className="w-full h-full object-cover rounded-3xl"
                                    />
                                </div>
                            </AnimatedDiv> */}
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section
                        id="contact"
                        className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background via-secondary/10 to-primary/10 relative overflow-hidden"
                    >
                        <div className="container px-4 md:px-6 text-center max-w-3xl mx-auto">
                            <AnimatedDiv delay={0}>
                                <div className="space-y-8 mb-16">
                                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                                        Ready to Make Waves?
                                    </h2>
                                    <p className="text-muted-foreground md:text-xl/relaxed">
                                        Whether you're a visionary brand, a groundbreaking creator, or just curious about the future of
                                        influence, let's connect. Your next big thing starts here.
                                    </p>
                                </div>
                            </AnimatedDiv>
                            <AnimatedDiv delay={200}>
                                <div className="bg-card p-12 rounded-3xl shadow-2xl border border-primary/50">
                                    <form className="grid gap-10" onSubmit={handleSubmit}>
                                        <div className="grid gap-4 text-left">
                                            <label htmlFor="form-type" className="text-lg font-medium">
                                                I am a:
                                            </label>
                                            <Select value={formType} onValueChange={setFormType}>
                                                <SelectTrigger id="form-type" className="w-full h-12 text-base">
                                                    <SelectValue placeholder="Select your role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="influencer">Influencer / Creator</SelectItem>
                                                    <SelectItem value="brand">Brand / Business</SelectItem>
                                                    <SelectItem value="other">Other Inquiry</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {formType === "influencer" && (
                                            <>
                                                <Input className="h-12 text-base" placeholder="Your Name" type="text" value={name} required
                                                    onChange={(e) => setName(e.target.value)} />
                                                <Input className="h-12 text-base" placeholder="Your Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                                <Input
                                                    className="h-12 text-base"
                                                    placeholder="Primary Social Media Link (e.g., TikTok, YouTube)"
                                                    type="url"
                                                    value={socialLink}
                                                    onChange={(e) => setSocialLink(e.target.value)}
                                                />
                                                <Input
                                                    className="h-12 text-base"
                                                    placeholder="Your Niche (e.g., Gaming, Fashion, Tech)"
                                                    type="text"
                                                    value={niche}
                                                    onChange={(e) => setNiche(e.target.value)}
                                                />
                                                <Textarea
                                                    className="min-h-[120px] text-base"
                                                    placeholder="Tell us about your passion, unique style, and collaboration ideas..."
                                                    rows={4}
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </>
                                        )}

                                        {formType === "brand" && (
                                            <>
                                                <Input className="h-12 text-base" placeholder="Company Name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                                                <Input className="h-12 text-base" placeholder="Contact Person Name" type="text" required value={contact} onChange={(e) => setContact(e.target.value)} />
                                                <Input className="h-12 text-base" placeholder="Company Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                                <Input className="h-12 text-base" placeholder="Company Website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
                                                <Input
                                                    className="h-12 text-base"
                                                    placeholder="Estimated Campaign Budget (e.g., $10k - $50k+)"
                                                    type="text"
                                                    value={budget}
                                                    onChange={(e) => setBudget(e.target.value)}
                                                />
                                                <Textarea
                                                    className="min-h-[120px] text-base"
                                                    placeholder="Describe your brand, strategic goals, and target audience..."
                                                    rows={4}
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </>
                                        )}

                                        {formType === "other" && (
                                            <>
                                                <Input className="h-12 text-base" placeholder="Your Name" type="text" required
                                                    value={name} onChange={(e) => setName(e.target.value)}
                                                />
                                                <Input className="h-12 text-base" placeholder="Your Email" type="email" required
                                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <Textarea className="min-h-[120px] text-base" placeholder="Your message..." rows={4}
                                                    value={message} onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground text-black"
                                            disabled={loading}
                                        >
                                            Send
                                        </Button>
                                    </form>
                                    <div style={{ visibility: 'hidden' }}>

                                        <ReCAPTCHA
                                            ref={captchaRef}
                                            sitekey={SITE_KEY}
                                            size="invisible"
                                            onChange={handleCaptcha}
                                            onErrored={() => setCaptchaLoading(false)}
                                            onExpired={() => setCaptchaLoading(false)}
                                            badge="bottomright"
                                        />
                                    </div>
                                </div>
                            </AnimatedDiv>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40 bg-background">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Newline. All rights reserved. Made by Alejo Martinez{" "}
                        <Sparkles className="inline-block h-4 w-4 text-primary" />.
                    </p>
                    <nav className="sm:ml-auto flex gap-6 sm:gap-8">
                        <a
                            href="#"
                            className="text-sm hover:underline underline-offset-4 text-muted-foreground hover:text-primary transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-sm hover:underline underline-offset-4 text-muted-foreground hover:text-primary transition-colors"
                        >
                            Terms of Service
                        </a>
                    </nav>
                </footer>
            </div>
        </ThemeProvider>
    )
}

export default App