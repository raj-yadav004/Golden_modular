"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChefHat, Sofa, BedDouble, Hammer, CheckCircle, MapPin, Phone, Mail, Star, Menu, X } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------
// NAVBAR
// ---------------------------------------------------------
function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed top-4 md:top-6 left-0 w-full z-50 px-4 md:px-6 flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "pointer-events-auto w-full max-w-6xl glass-dark flex flex-col transition-all duration-500 overflow-hidden",
          isOpen ? "rounded-3xl" : "rounded-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-3 md:px-8 md:py-4">
          <div className="text-xl md:text-2xl font-bold tracking-tighter uppercase text-white">
            Golden <span className="text-gold">Modular</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide text-white/80">
            {["About", "Services", "Portfolio", "Process", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-gold transition-colors duration-300 relative group py-2">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          
          <button className="hidden md:flex px-6 py-2.5 bg-white text-charcoal rounded-full text-sm font-semibold hover:bg-gold hover:text-white transition-all duration-300 items-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            Book Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white p-2 focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10"
            >
              <div className="flex flex-col gap-6 py-8 px-8">
                {["About", "Services", "Portfolio", "Process", "Contact"].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setTimeout(() => setIsOpen(false), 150)}
                    className="text-lg font-medium text-white/80 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <button className="px-6 py-4 bg-white text-charcoal rounded-full text-sm font-semibold hover:bg-gold hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 mt-4 w-full">
                  Book Consultation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

// ---------------------------------------------------------
// HERO
// ---------------------------------------------------------
function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameCount = 192; // 0 to 191

  useGSAP(() => {
    // Load images
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.decoding = "async"; // Offload decoding to a background thread
      const num = i.toString().padStart(4, '0');
      img.src = `/golden_modular_frames/frame_${num}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          // Draw first frame immediately
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d', { alpha: false }); // Disable alpha for perf
          if (canvas && ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Create sequence animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%", // Increased scroll distance to slow down frames
        scrub: 1.5, // Smooth scrub with slight easing
        pin: true,
      }
    });

    const playhead = { frame: 0 };
    tl.to(playhead, {
      frame: frameCount - 1,
      ease: "none",
      duration: 1, // Stretch across entire scroll
      onUpdate: () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { alpha: false });
        const frameIndex = Math.round(playhead.frame);
        const img = imagesRef.current[frameIndex];
        if (canvas && ctx && img && img.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }
    }, 0);

    // Fade out text block early so it gets out of the way of the frames
    tl.to(textRef.current, {
      opacity: 0,
      y: -50,
      ease: "power2.inOut",
      duration: 0.15
    }, 0);

    // Fade out stats block early
    tl.to(statsRef.current, {
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.15
    }, 0);

    // Canvas opacity transition (0.6 to 1)
    gsap.set(canvasRef.current, { opacity: 0.6 });
    tl.to(canvasRef.current, { 
      opacity: 1, 
      ease: "none",
      duration: 1
    }, 0);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-screen w-full bg-charcoal overflow-hidden flex items-center justify-center relative" style={{ willChange: "transform" }}>
      <div className="absolute inset-0 w-full h-full bg-charcoal">
        <canvas 
          ref={canvasRef} 
          width={1920} 
          height={1080} 
          className="w-full h-full object-cover"
          style={{ willChange: "opacity" }}
        />
      </div>

      <div ref={textRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full border border-white/20 glass text-white/90 text-xs font-semibold tracking-widest uppercase mb-6"
        >
          Premium Interior Design Studio
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-4 md:mb-6 max-w-4xl leading-[1.15] md:leading-[1.1]"
        >
          Crafting Timeless <span className="text-gold italic font-light pr-2">Modular</span> Spaces
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-base sm:text-lg text-white/70 max-w-2xl font-light mb-8 md:mb-10 leading-relaxed px-4 md:px-0"
        >
          Premium modular kitchens, wardrobes and complete interior solutions designed with absolute precision and elegant minimalism.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 w-full sm:w-auto px-4 sm:px-0"
        >
          <motion.a href="#portfolio" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 md:px-7 md:py-3.5 bg-white text-charcoal rounded-full text-sm font-medium hover:bg-gold hover:text-white transition-all duration-300 w-full sm:w-auto shadow-lg shadow-white/5 hover:shadow-gold/20 flex justify-center">
            Explore Portfolio
          </motion.a>
          <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 md:px-7 md:py-3.5 bg-transparent border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-300 w-full sm:w-auto flex justify-center">
            Book Consultation
          </motion.a>
        </motion.div>
      </div>

      <div 
        ref={statsRef}
        className="absolute bottom-12 left-0 w-full px-4 md:px-12 pointer-events-none z-10 hidden sm:block"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white/60 text-xs md:text-sm font-medium tracking-wide border-t border-white/10 pt-6">
          <div className="flex flex-col"><span className="text-white text-xl md:text-2xl font-light">15+</span> Years Experience</div>
          <div className="flex flex-col"><span className="text-white text-xl md:text-2xl font-light">500+</span> Premium Projects</div>
          <div className="flex flex-col"><span className="text-white text-xl md:text-2xl font-light">1000+</span> Happy Clients</div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// MARQUEE
// ---------------------------------------------------------
function Marquee() {
  const marqueeItems = [
    "Luxury Kitchens", "•", "Bespoke Wardrobes", "•", "Premium Interiors", "•", "Smart Living", "•",
    "Luxury Kitchens", "•", "Bespoke Wardrobes", "•", "Premium Interiors", "•", "Smart Living", "•",
  ];

  return (
    <section className="bg-charcoal text-white py-4 overflow-hidden flex border-b border-white/10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex whitespace-nowrap items-center w-max"
      >
        {marqueeItems.map((item, i) => (
          <span 
            key={i} 
            className={cn(
              "text-sm md:text-base uppercase font-medium tracking-[0.2em] px-6",
              item === "•" ? "text-gold" : "text-white"
            )}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------
// ABOUT
// ---------------------------------------------------------
function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-warm-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden"
          style={{ willChange: "transform, opacity" }}
        >
          <Image src="/images/living_room.png" alt="Luxury Living Room" fill className="object-cover" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Redefining Luxury Interiors</h2>
          <p className="text-charcoal/70 text-lg font-light leading-relaxed mb-8">
            At Golden Modular, we believe that your home is a reflection of your identity. We craft bespoke modular solutions that merge architectural precision with unmatched aesthetics. Every material is handpicked, every joint is meticulously engineered, and every space is transformed into a masterpiece.
          </p>
          <div className="grid grid-cols-2 gap-8">
            {[
              { title: "Premium Materials", desc: "Sourced globally for durability and elegance." },
              { title: "Master Craftsmanship", desc: "Precision engineering down to the millimeter." },
              { title: "Innovative Design", desc: "Merging functionality with ultra-modern aesthetics." },
              { title: "Client Centric", desc: "A seamless, white-glove experience from day one." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <CheckCircle className="w-5 h-5 text-gold mb-3" />
                <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-charcoal/60 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// SERVICES
// ---------------------------------------------------------
const services = [
  { icon: <ChefHat className="w-8 h-8" />, title: "Modular Kitchens", desc: "Ergonomic, sleek, and highly functional culinary spaces." },
  { icon: <BedDouble className="w-8 h-8" />, title: "Luxury Wardrobes", desc: "Bespoke walk-in and sliding wardrobes with premium finishes." },
  { icon: <Sofa className="w-8 h-8" />, title: "Living Room Interiors", desc: "Cinematic and inviting spaces tailored to your lifestyle." },
  { icon: <Hammer className="w-8 h-8" />, title: "Complete Solutions", desc: "End-to-end interior design and execution for your entire home." },
];

function Services() {
  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-charcoal text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium tracking-tight mb-4"
          >
            Bespoke Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg font-light max-w-2xl"
          >
            Elevate every corner of your home with our specialized modular solutions.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl glass-dark hover:bg-white/10 border border-white/5 hover:border-gold/30 transition-all duration-500 group cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-colors duration-500" />
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                {svc.icon}
              </div>
              <h3 className="text-xl font-medium mb-3">{svc.title}</h3>
              <p className="text-sm font-light text-white/60 leading-relaxed">
                {svc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// PORTFOLIO (Masonry)
// ---------------------------------------------------------
function Portfolio() {
  const projects = [
    { src: "/images/kitchen.png", title: "Minimalist Kitchen", size: "col-span-1 md:col-span-2 row-span-2" },
    { src: "/images/wardrobe.png", title: "Glass Wardrobe", size: "col-span-1 row-span-1" },
    { src: "/images/living_room.png", title: "Monochrome Living", size: "col-span-1 row-span-2" },
    { src: "/images/bedroom.png", title: "Warm Bedroom", size: "col-span-1 row-span-1" },
  ];

  return (
    <section id="portfolio" className="py-32 px-6 md:px-12 bg-warm-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-16"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Curated Portfolio</h2>
            <p className="text-charcoal/60 text-lg font-light max-w-xl">
              A selection of our finest architectural and interior achievements.
            </p>
          </div>
          <button className="hidden md:block pb-2 border-b border-charcoal text-sm font-medium hover:text-gold hover:border-gold transition-colors">
            View All Projects
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {projects.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={cn("relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl", proj.size)}
            >
              <Image src={proj.src} alt={proj.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500 backdrop-blur-[2px] opacity-0 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <h3 className="text-2xl font-medium text-white tracking-wide">{proj.title}</h3>
                <p className="text-gold font-medium text-sm mt-2 uppercase tracking-widest flex items-center gap-2">
                  View Project <ArrowRight className="w-4 h-4" />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// PROCESS
// ---------------------------------------------------------
function Process() {
  const steps = [
    { title: "Consultation", desc: "Understanding your vision and lifestyle requirements." },
    { title: "Planning & 3D Design", desc: "Detailed layouts and photorealistic renderings." },
    { title: "Manufacturing", desc: "Precision engineering at our state-of-the-art facility." },
    { title: "Installation", desc: "Flawless execution by our expert craftsmen." },
  ];

  return (
    <section id="process" className="py-32 px-6 md:px-12 bg-charcoal text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">The Master Plan</h2>
            <p className="text-white/60 text-lg font-light max-w-xl">
              Our four-step methodology ensures an immaculate transition from conceptual vision to tangible reality.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
              className="relative group p-8 md:p-10 rounded-3xl glass-dark border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-500 overflow-hidden min-h-[320px] flex flex-col justify-end hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)]"
            >
              <div className="absolute top-6 right-6 text-7xl font-bold text-white/5 group-hover:text-gold/10 transition-colors duration-500 pointer-events-none select-none">
                0{i + 1}
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-medium mb-3">{step.title}</h3>
                <p className="text-white/60 font-light text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// CONTACT
// ---------------------------------------------------------
function Contact() {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-warm-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Get In Touch</h2>
          <p className="text-charcoal/70 text-lg font-light leading-relaxed mb-12 max-w-md">
            Ready to transform your space? Visit our showroom or drop us a message to start the conversation.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-gold mt-1" />
              <div>
                <h4 className="font-medium text-lg">Showroom Address</h4>
                <p className="text-charcoal/60 font-light">123 Luxury Avenue, Design District<br/>Mumbai, India 400001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-gold mt-1" />
              <div>
                <h4 className="font-medium text-lg">Phone</h4>
                <p className="text-charcoal/60 font-light">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-gold mt-1" />
              <div>
                <h4 className="font-medium text-lg">Email</h4>
                <p className="text-charcoal/60 font-light">studio@goldenmodular.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 rounded-2xl bg-white border border-black/5 shadow-xl">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" className="w-full pb-3 bg-transparent border-b border-charcoal/20 focus:border-gold outline-none transition-colors font-light placeholder:text-charcoal/40" />
            <input type="email" placeholder="Email Address" className="w-full pb-3 bg-transparent border-b border-charcoal/20 focus:border-gold outline-none transition-colors font-light placeholder:text-charcoal/40" />
            <input type="tel" placeholder="Phone Number" className="w-full pb-3 bg-transparent border-b border-charcoal/20 focus:border-gold outline-none transition-colors font-light placeholder:text-charcoal/40" />
            <textarea placeholder="Tell us about your project" rows={4} className="w-full pb-3 bg-transparent border-b border-charcoal/20 focus:border-gold outline-none transition-colors font-light placeholder:text-charcoal/40 resize-none" />
            <button className="px-8 py-4 bg-charcoal text-white rounded-full font-medium hover:bg-gold transition-colors duration-300 mt-4">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------
function Testimonials() {
  const testimonials = [
    {
      name: "Alexander D.",
      role: "Penthouse Owner",
      quote: "The attention to detail is truly unparalleled. Golden Modular transformed our empty apartment into a cinematic luxury experience. Every guest is in awe.",
    },
    {
      name: "Sophia L.",
      role: "Architect",
      quote: "As an architect, I demand absolute precision. Their engineering and material selection exceeded my incredibly high standards. Flawless execution.",
    },
    {
      name: "Marcus R.",
      role: "Villa Owner",
      quote: "From the initial 3D renders to the final installation, the process was white-glove and completely stress-free. The bespoke wardrobes are a work of art.",
    }
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-charcoal text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16 text-center">Client Impressions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="p-10 rounded-3xl glass-dark border border-white/5 relative group hover:bg-white/5 transition-colors duration-500"
            >
              <div className="absolute top-10 right-10 text-6xl text-gold/10 font-serif leading-none select-none pointer-events-none group-hover:text-gold/20 transition-colors duration-500">
                "
              </div>
              <div className="flex gap-1 text-gold mb-8">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-white/80 text-lg font-light leading-relaxed mb-10 italic relative z-10">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/40 to-gold/10 p-[1px]">
                  <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center text-sm font-medium">
                    {t.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-base">{t.name}</h4>
                  <p className="text-sm text-gold/70 font-light">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// CTA & FOOTER
// ---------------------------------------------------------
function Footer() {
  return (
    <>
      <section className="relative overflow-hidden py-40 px-6 text-center bg-warm-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-medium tracking-tight mb-8 relative z-10"
        >
          Let's Design Your <br/><span className="text-gold italic font-light">Dream Space</span>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="px-10 py-5 bg-charcoal text-white rounded-full text-lg font-medium hover:bg-gold transition-colors duration-300 shadow-xl shadow-charcoal/10 relative z-10"
        >
          Book Free Consultation
        </motion.button>
        <div className="absolute inset-0 w-full h-full pointer-events-none flex justify-center items-center opacity-30 blur-[100px]">
          <div className="w-[40rem] h-[20rem] bg-gold rounded-full" />
        </div>
      </section>

      <footer className="bg-charcoal text-white pt-24 pb-8 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold tracking-tighter uppercase text-white mb-6">
              Golden <span className="text-gold">Modular</span>
            </div>
            <p className="text-white/60 font-light max-w-sm mb-8">
              Elevating living spaces with unmatched craftsmanship and ultra-modern aesthetic design.
            </p>
            <div className="flex gap-4 text-white/50 text-sm">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3 text-white/60 font-light text-sm">
              {["Portfolio", "Services", "About Us", "Contact"].map(link => (
                <li key={link}><a href="#" className="hover:text-gold transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6">Contact</h4>
            <ul className="space-y-4 text-white/60 font-light text-sm">
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gold" /> Mumbai, India</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold" /> +91 98765 43210</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold" /> studio@goldenmodular.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 font-light">
          <p>© 2026 Golden Modular. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}

function Preloader() {
  const container = useRef<HTMLDivElement>(null);
  const text1 = useRef<HTMLSpanElement>(null);
  const text2 = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Fade in texts
    tl.to([text1.current, text2.current], {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out",
      delay: 0.2
    });

    // Hold for a moment, then slide texts up
    tl.to([text1.current, text2.current], {
      y: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power4.in",
      delay: 0.5
    });

    // Slide the whole curtain up
    tl.to(container.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut"
    });
  }, { scope: container });

  return (
    <div 
      ref={container} 
      className="fixed inset-0 z-[9999] bg-charcoal flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="overflow-hidden flex gap-4 text-3xl md:text-5xl font-medium tracking-tighter uppercase text-white">
        <span ref={text1} className="translate-y-[100%] opacity-0 inline-block">Golden</span>
        <span ref={text2} className="translate-y-[100%] opacity-0 text-gold inline-block">Modular</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// MAIN PAGE EXPORT
// ---------------------------------------------------------
export default function Page() {
  return (
    <main className="bg-warm-white min-h-screen">
      <Preloader />
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Portfolio />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
