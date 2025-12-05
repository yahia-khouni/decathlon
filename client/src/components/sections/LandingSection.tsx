import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Brain, Dumbbell } from "lucide-react";
import DecathlonLogo from "@/assets/Decathlon.png";

interface LandingSectionProps {
  onStart: () => void;
}

export function LandingSection({ onStart }: LandingSectionProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top White Bar with Decathlon Logo */}
      <div className="bg-white h-20 px-8 shadow-md flex items-center">
        <div className="container mx-auto flex items-center">
          <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
        </div>
      </div>

      {/* Main Section */}
      <section
        id="landing"
        className="relative flex-1 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)"
        }}
      >
        {/* Decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
            }}
          />
          <div
            className="absolute top-1/3 -left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
            }}
          />
        </div>

        {/* Running People Illustration - Blended with background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
          <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Running Person 1 - Left side */}
            <g transform="translate(250, 450)" opacity="0.6">
              <ellipse cx="0" cy="0" rx="30" ry="45" fill="rgba(255, 235, 0, 0.8)" />
              <circle cx="0" cy="-50" r="25" fill="rgba(255, 235, 0, 0.8)" />
              <line x1="0" y1="5" x2="-40" y2="60" stroke="rgba(255, 235, 0, 0.8)" strokeWidth="12" strokeLinecap="round" />
              <line x1="0" y1="5" x2="45" y2="55" stroke="rgba(255, 235, 0, 0.8)" strokeWidth="12" strokeLinecap="round" />
              <line x1="0" y1="35" x2="-35" y2="-30" stroke="rgba(255, 235, 0, 0.8)" strokeWidth="10" strokeLinecap="round" />
              <line x1="0" y1="35" x2="50" y2="-15" stroke="rgba(255, 235, 0, 0.8)" strokeWidth="10" strokeLinecap="round" />
            </g>
            {/* Running Person 2 - Center */}
            <g transform="translate(700, 500)" opacity="0.5">
              <ellipse cx="0" cy="0" rx="35" ry="50" fill="rgba(255, 255, 255, 0.6)" />
              <circle cx="0" cy="-55" r="28" fill="rgba(255, 255, 255, 0.6)" />
              <line x1="0" y1="5" x2="-45" y2="55" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="14" strokeLinecap="round" />
              <line x1="0" y1="5" x2="40" y2="65" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="14" strokeLinecap="round" />
              <line x1="0" y1="40" x2="-30" y2="-35" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="12" strokeLinecap="round" />
              <line x1="0" y1="40" x2="55" y2="-10" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="12" strokeLinecap="round" />
            </g>
            {/* Running Person 3 - Right side */}
            <g transform="translate(1100, 480)" opacity="0.6">
              <ellipse cx="0" cy="0" rx="32" ry="48" fill="rgba(255, 235, 0, 0.7)" />
              <circle cx="0" cy="-52" r="26" fill="rgba(255, 235, 0, 0.7)" />
              <line x1="0" y1="5" x2="-38" y2="58" stroke="rgba(255, 235, 0, 0.7)" strokeWidth="13" strokeLinecap="round" />
              <line x1="0" y1="5" x2="42" y2="60" stroke="rgba(255, 235, 0, 0.7)" strokeWidth="13" strokeLinecap="round" />
              <line x1="0" y1="38" x2="-40" y2="-25" stroke="rgba(255, 235, 0, 0.7)" strokeWidth="11" strokeLinecap="round" />
              <line x1="0" y1="38" x2="45" y2="-30" stroke="rgba(255, 235, 0, 0.7)" strokeWidth="11" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              {/* Main Heading */}
              <div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight" style={{ marginBottom: '24px' }}>
                  TROUVEZ VOTRE
                  <br />
                  <span className="text-[#ffeb00]">SPORT IDÉAL</span>
                </h1>
                <p className="text-lg lg:text-xl text-white/90 max-w-xl leading-relaxed" style={{ marginBottom: '60px' }}>
                  Notre système d'analyse personnalisée vous guide vers les sports et équipements
                  parfaitement adaptés à votre profil et vos objectifs.
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <Button
                  onClick={onStart}
                  size="lg"
                  className="group relative bg-gradient-to-r from-[#ffeb00] to-[#ffd700] text-[#0082c3] hover:from-[#ffd700] hover:to-[#ffeb00] font-bold text-lg rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(255,235,0,0.5)] transition-all duration-300 hover:scale-105 border-2 border-[#ffeb00]/30"
                  style={{ padding: '28px 48px' }}
                >
                  <span className="relative z-10 flex items-center">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                </Button>
              </div>
            </motion.div>

            {/* Right Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end w-full"
            >
              <div 
                className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50"
                style={{ padding: '36px 32px', width: '100%', maxWidth: '440px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* AI Powered - Main Feature */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center border-b border-gray-100"
                    style={{ paddingBottom: '24px' }}
                  >
                    <div className="flex items-center justify-center" style={{ gap: '16px', marginBottom: '16px' }}>
                      <div className="bg-gradient-to-br from-[#0082c3] to-[#004f7c] rounded-xl shadow-md" style={{ padding: '14px' }}>
                        <Brain style={{ width: '36px', height: '36px', color: '#ffeb00' }} />
                      </div>
                      <div className="bg-gradient-to-br from-[#ffeb00] to-[#ffd700] rounded-xl shadow-md" style={{ padding: '14px' }}>
                        <Dumbbell style={{ width: '36px', height: '36px', color: '#0082c3' }} />
                      </div>
                    </div>
                    <div 
                      className="font-black bg-gradient-to-r from-[#0082c3] to-[#004f7c] bg-clip-text text-transparent"
                      style={{ fontSize: '26px', marginBottom: '8px' }}
                    >
                      IA Personnalisée
                    </div>
                    <div className="text-gray-500 font-medium leading-relaxed" style={{ fontSize: '14px', padding: '0 8px' }}>
                      Recommandations intelligentes basées sur vos besoins
                    </div>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                    {/* Stat 1 - Exercises */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-center rounded-xl bg-gradient-to-br from-[#0082c3]/5 to-transparent hover:from-[#0082c3]/10 transition-all"
                      style={{ padding: '18px' }}
                    >
                      <div 
                        className="font-black bg-gradient-to-br from-[#0082c3] to-[#004f7c] bg-clip-text text-transparent"
                        style={{ fontSize: '38px', marginBottom: '4px' }}
                      >
                        873
                      </div>
                      <div className="text-gray-500 font-semibold uppercase tracking-wide" style={{ fontSize: '12px' }}>
                        Exercices
                      </div>
                    </motion.div>

                    {/* Stat 2 - Products */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-center rounded-xl bg-gradient-to-br from-[#ffeb00]/10 to-transparent hover:from-[#ffeb00]/20 transition-all"
                      style={{ padding: '18px' }}
                    >
                      <div 
                        className="font-black bg-gradient-to-br from-[#ffeb00] to-[#ffd700] bg-clip-text text-transparent"
                        style={{ fontSize: '38px', marginBottom: '4px' }}
                      >
                        216
                      </div>
                      <div className="text-gray-500 font-semibold uppercase tracking-wide" style={{ fontSize: '12px' }}>
                        Produits
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom White Bar with Made by Cods */}
      <div className="bg-white h-16 px-8 border-t border-gray-200 shadow-inner flex items-center justify-center">
        <div className="container mx-auto text-center">
          <p className="text-base text-gray-700 font-medium">
            Made by <span className="font-bold text-[#0082c3]">Cods</span>
          </p>
        </div>
      </div>
    </div>
  );
}
