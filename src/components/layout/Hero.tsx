import React, { lazy, Suspense, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, MapPin, Brain, Users, Trophy, Star,
  Award, GraduationCap, Calculator, PlayCircle,
  CheckCircle2, Building2, BookOpen
} from 'lucide-react';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Hero = () => {
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '50px'
  });

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E5DEFF] via-[#F5E6FF] to-white">
          <BackgroundEffects />
        </div>
        
        {/* Hero Section with Side-by-Side Layout */}
        <section id="hero" className="min-h-[90vh] flex items-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content Column */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 leading-tight">
                      Transform Math into an Epic Adventure
                    </h1>
                  </div>
                  
                  <p className="text-xl md:text-2xl text-gray-600 animate-fade-in leading-relaxed">
                    Watch your child's confidence soar as they master math through exciting quests and rewards. Perfect for grades K1-G5.
                  </p>

                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <Button 
                      onClick={() => navigate('/demo')} 
                      size="lg" 
                      className="group bg-accent-500 hover:bg-accent-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                    >
                      <PlayCircle className="w-6 h-6" />
                      Watch Demo
                    </Button>

                    <Button 
                      onClick={() => navigate('/login')} 
                      size="lg" 
                      className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                    >
                      <span>Begin Your Quest</span>
                      <MapPin className="w-5 h-5 group-hover:animate-bounce" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-primary-100 shadow-lg space-y-4">
                  <h3 className="text-xl font-semibold text-primary-700">
                    Parents & Teachers Love Math Mentor
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <Brain className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className="text-gray-600">Adaptive Learning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <Trophy className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className="text-gray-600">Progress Tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <Star className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className="text-gray-600">Fun Rewards</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <Calculator className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className="text-gray-600">Interactive Tools</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Visual Column */}
              <div className="relative">
                <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-primary-50/30" />
                  <img
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
                    alt="Student using Math Mentor"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 animate-bounce-slow">
                      <img 
                        alt="Explorer Guide" 
                        className="w-full h-full object-contain drop-shadow-xl"
                        src="https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars//hand-drawn-brain-cartoon-illustration.png"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Achievement Cards */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-lg border border-primary-100 animate-float">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-primary-700">50,000+ Badges Earned</span>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 bg-white rounded-lg p-4 shadow-lg border border-primary-100 animate-float animation-delay-2000">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-primary-700">10,000+ Active Explorers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid with Interactive Cards */}
        <section id="features" className="py-16 bg-gradient-to-b from-white/50 to-primary-50/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-primary-700 mb-12">
              Embark on Your Math Adventure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Adaptive Learning",
                  description: "Smart algorithms adjust to your child's pace",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: Trophy,
                  title: "Achievement System",
                  description: "Unlock rewards as skills improve",
                  color: "from-amber-500 to-orange-500"
                },
                {
                  icon: Calculator,
                  title: "Interactive Tools",
                  description: "Hands-on practice with visual aids",
                  color: "from-blue-500 to-cyan-500"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${feature.color}" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-primary-700 text-center mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-center text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Stats Grid */}
        <section id="stats" className="py-16 bg-gradient-to-b from-primary-50/30 to-white/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  value: "10,000+",
                  label: "Active Explorers",
                  color: "from-blue-500 to-purple-500"
                },
                {
                  icon: Star,
                  value: "1M+",
                  label: "Questions Solved",
                  color: "from-amber-500 to-red-500"
                },
                {
                  icon: Award,
                  value: "50,000+",
                  label: "Badges Earned",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden p-8 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <stat.icon className="w-12 h-12 text-primary-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-4xl font-bold text-primary-700 mb-3 text-center group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-xl text-center">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Grid */}
        <section id="stories" className="py-16 bg-gradient-to-b from-primary-50/30 to-white/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-primary-700 mb-12">
              Explorer Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah, Grade 4",
                  quote: "Math used to be scary, but now it's like going on an adventure every day!",
                  achievement: "Number Master"
                },
                {
                  name: "Mike, Grade 3",
                  quote: "I love collecting badges while learning new things. It's super fun!",
                  achievement: "Pattern Explorer"
                },
                {
                  name: "Emily, Grade 5",
                  quote: "The interactive tools helped me understand fractions better than ever.",
                  achievement: "Problem Solver"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-6 h-6 text-primary-600" />
                    </div>
                    <span className="font-semibold text-xl text-primary-700">
                      {testimonial.name}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-primary-600 font-medium text-lg group-hover:text-primary-700 transition-colors duration-300">
                    {testimonial.achievement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Social Proof Section */}
        <section id="social-proof" className="py-16 bg-gradient-to-b from-primary-50/30 to-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-700 mb-4">
                Trusted by Parents and Educators
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of families transforming math learning into an adventure
              </p>
            </div>

            {/* Achievement Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {[
                { icon: Users, value: "50,000+", label: "Active Students" },
                { icon: Trophy, value: "1M+", label: "Quests Completed" },
                { icon: Star, value: "98%", label: "Parent Satisfaction" },
                { icon: Award, value: "4.9/5", label: "App Store Rating" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <stat.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-primary-700 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Student Success Stories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "Sarah Chen",
                  grade: "Grade 4",
                  image: "https://images.unsplash.com/photo-1517677129300-07b130802f46?auto=format&fit=crop&w=150&h=150&q=80",
                  quote: "Math used to be scary, but now it's like going on a treasure hunt every day! I love earning badges.",
                  achievement: "Improved from C to A+"
                },
                {
                  name: "Marcus Rodriguez",
                  grade: "Grade 3",
                  image: "https://images.unsplash.com/photo-1517140850025-89db2c515ef8?auto=format&fit=crop&w=150&h=150&q=80",
                  quote: "The quests make learning so much fun! I especially love the number recognition games.",
                  achievement: "Mastered multiplication in 3 months"
                },
                {
                  name: "Emma Thompson",
                  grade: "Grade 5",
                  image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=150&h=150&q=80",
                  quote: "I never thought I'd say math is my favorite subject, but here we are! Thank you Math Mentor!",
                  achievement: "Now tutors younger students"
                }
              ].map((story, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16 border-2 border-primary-200">
                        <AvatarImage src={story.image} alt={story.name} />
                        <AvatarFallback>{story.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-primary-700">{story.name}</h3>
                        <p className="text-gray-600">{story.grade}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 italic">&quot;{story.quote}&quot;</p>
                    <Badge variant="secondary" className="bg-primary-100 text-primary-700">
                      {story.achievement}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Parent Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  name: "Dr. Lisa Parker",
                  title: "Parent & Education Researcher",
                  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
                  quote: "As both a parent and an education researcher, I'm impressed by Math Mentor's approach to making mathematics accessible and enjoyable. The progress tracking features are exceptional."
                },
                {
                  name: "Michael Chang",
                  title: "Parent of Two Math Explorers",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
                  quote: "Math Mentor has transformed our evening homework sessions from stressful to enjoyable. Both my children look forward to their daily quests!"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-white/90 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16 border-2 border-primary-200">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-primary-700">{testimonial.name}</h3>
                        <p className="text-gray-600">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">&quot;{testimonial.quote}&quot;</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trust Badges & Educational Partners */}
            <div className="text-center space-y-8">
              <h3 className="text-2xl font-semibold text-primary-700 mb-6">
                Trusted By Leading Educational Institutions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
                {[
                  { icon: Building2, name: "Accredited Learning Provider" },
                  { icon: CheckCircle2, name: "COPPA Compliant" },
                  { icon: BookOpen, name: "Common Core Aligned" },
                  { icon: Award, name: "Parent Choice Award" }
                ].map((badge, index) => (
                  <div key={index} className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <badge.icon className="w-12 h-12 text-primary-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700 text-center">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div ref={parentRef} className="bg-gradient-to-b from-transparent to-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div ref={sectionRef} className="grid gap-24 py-24">
              <Suspense fallback={<SectionLoader text="Gathering fellow explorers..." />}>
                {isVisible && <ExplorerProfiles />}
              </Suspense>

              <Suspense fallback={<SectionLoader text="Decoding ancient scrolls..." />}>
                {isVisible && <FAQSection />}
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
};

const BackgroundEffects = () => (
  <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
    <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
    <div className="absolute top-20 right-10 w-64 h-64 bg-primary-100/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-64 h-64 bg-primary-300/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
    
    <MathSymbols />
  </div>
);

const MathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none">
    {['÷', '×', '+', '−', '=', '∑', 'π', '∫', '√', '∞'].map((symbol, index) => (
      <div
        key={index}
        className="absolute text-2xl text-primary-400/20 animate-float cursor-default transition-all duration-300 hover:text-primary-400/40 hover:scale-125"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${index * 0.5}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
        }}
      >
        {symbol}
      </div>
    ))}
  </div>
);

const SectionLoader = ({ text }: { text: string }) => (
  <div className="w-full animate-pulse space-y-4 p-8 rounded-lg bg-white/50 backdrop-blur-sm shadow-lg transition-all duration-300">
    <div className="h-8 w-3/4 bg-primary-100 rounded-lg mx-auto"></div>
    <div className="space-y-4">
      <div className="h-4 w-full bg-primary-50 rounded"></div>
      <div className="h-4 w-5/6 bg-primary-50 rounded"></div>
      <div className="h-4 w-4/6 bg-primary-50 rounded"></div>
    </div>
    <div className="flex items-center justify-center mt-6">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);

export default Hero;
