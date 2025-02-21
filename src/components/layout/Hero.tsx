
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, MapPin, BookOpen, Target, Trophy, 
  Clock, Users, Scroll, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Hero = () => {
  const navigate = useNavigate();
  
  return <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#E5DEFF] via-[#F5E6FF] to-white transition-all duration-1000">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
        
        {/* Floating Math Symbols */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['÷', '×', '+', '−', '=', '∑', 'π'].map((symbol, index) => <div key={index} className={`absolute text-2xl text-primary-400/20 animate-float`} style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${index * 0.5}s`,
          transform: `rotate(${Math.random() * 360}deg)`
        }}>
              {symbol}
            </div>)}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col items-center max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="flex items-center gap-4 mb-6">
            <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
            <h1 className="animate-fade-in text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Math Mentor
            </h1>
            <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
          </div>
          
          <p className="text-xl md:text-2xl text-primary-600/80 mb-8 animate-fade-in">
            The Grand Adventure
          </p>
          
          {/* Animated Mascot */}
          <div className="relative w-32 h-32 mb-8 animate-bounce-slow">
            <img alt="Explorer Guide" className="w-full h-full object-contain" src="https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars//hand-drawn-brain-cartoon-illustration.png" />
          </div>
          
          {/* Description */}
          <div className="max-w-2xl mb-8 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-primary-100 shadow-xl">
            <p className="animate-fade-in text-xl md:text-2xl text-gray-600">
              Embark on an exciting journey through numbers, shapes, and mathematical wonders. Perfect for grades K1-G5.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200 mb-16">
            <Button onClick={() => navigate('/login')} size="lg" className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
              <span>Begin Your Quest</span>
              <MapPin className="w-5 h-5 group-hover:animate-bounce" />
            </Button>
            
            <Button onClick={() => navigate('/demo')} variant="outline" size="lg" className="bg-white hover:bg-gray-50 text-primary-600 border-primary-200 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Try Demo
            </Button>
          </div>

          {/* How It Works Section */}
          <div className="w-full max-w-4xl mb-16">
            <h2 className="text-3xl font-bold text-primary-600 mb-8 text-center">How The Adventure Unfolds</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
                icon: BookOpen,
                title: "Choose Your Path",
                description: "Select your grade and begin your mathematical expedition"
              }, {
                icon: Target,
                title: "Complete Quests",
                description: "Solve engaging puzzles and earn treasure points"
              }, {
                icon: Trophy,
                title: "Earn Rewards",
                description: "Collect badges and unlock special achievements"
              }].map((step, index) => <div key={index} className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <step.icon className="w-12 h-12 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>)}
            </div>
          </div>

          {/* Features Timeline */}
          <div className="w-full max-w-4xl mb-16">
            <h2 className="text-3xl font-bold text-primary-600 mb-8 text-center">Your Learning Journey</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary 200"></div>
              
              {/* Timeline Items */}
              {[{
                icon: BookOpen,
                title: "Interactive Lessons",
                description: "Engage with animated content and guided practice"
              }, {
                icon: Target,
                title: "Adaptive Quests",
                description: "Face challenges that adapt to your skill level"
              }, {
                icon: Trophy,
                title: "Achievement System",
                description: "Earn badges and unlock special rewards"
              }, {
                icon: Users,
                title: "Explorer Community",
                description: "Learn and grow alongside fellow adventurers"
              }].map((item, index) => (
                <div key={index} className={`flex items-center gap-8 mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-xl font-semibold text-primary-700 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Explorers */}
          <div className="w-full max-w-4xl mb-16">
            <h2 className="text-3xl font-bold text-primary-600 mb-8 text-center">Featured Explorers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                name: "Alex",
                grade: "Grade 3",
                achievement: "Number Ninja Master",
                progress: "Completed 50 quests"
              }, {
                name: "Maria",
                grade: "Grade 4",
                achievement: "Pattern Explorer Elite",
                progress: "Earned 25 badges"
              }, {
                name: "Jordan",
                grade: "Grade 2",
                achievement: "Geometry Pioneer",
                progress: "Perfect score streak"
              }].map((explorer, index) => (
                <div key={index} className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-700 text-center mb-2">{explorer.name}</h3>
                  <p className="text-gray-600 text-center mb-2">{explorer.grade}</p>
                  <p className="text-primary-600 font-medium text-center mb-1">{explorer.achievement}</p>
                  <p className="text-sm text-gray-500 text-center">{explorer.progress}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section styled as ancient scroll */}
          <div className="w-full max-w-4xl mb-16">
            <h2 className="text-3xl font-bold text-primary-600 mb-8 text-center">Ancient Scrolls of Knowledge</h2>
            <div className="relative">
              {/* Scroll decoration */}
              <div className="absolute inset-0 bg-[#FEF7CD] rounded-2xl transform -rotate-1"></div>
              <div className="relative p-8 bg-[#FEF7CD]/80 backdrop-blur-sm rounded-2xl border-2 border-primary-200 shadow-xl">
                <Accordion type="single" collapsible className="space-y-4">
                  {[{
                    question: "What age group is Math Mentor designed for?",
                    answer: "Math Mentor is specially crafted for young explorers in grades K1 through G5, making mathematics engaging and accessible for children aged 5-11."
                  }, {
                    question: "How does the adaptive learning system work?",
                    answer: "Our magical quests adapt to each explorer's skill level. As you progress, the challenges adjust to ensure you're always learning at the perfect pace for your abilities."
                  }, {
                    question: "What types of rewards can explorers earn?",
                    answer: "Brave explorers can earn magical badges, treasure points, and special achievements. These rewards unlock new quests and recognize your mathematical mastery!"
                  }, {
                    question: "Can parents track their child's progress?",
                    answer: "Yes! Parents receive enchanted scrolls (progress reports) detailing their young explorer's adventures, achievements, and areas where they might need additional guidance."
                  }].map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-primary-200">
                      <AccordionTrigger className="text-lg font-semibold text-primary-700 hover:text-primary-600">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="w-full max-w-4xl mb-16">
            <h2 className="text-3xl font-bold text-primary-600 mb-8 text-center">What Explorers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{
                quote: "Math Mentor has transformed how my daughter approaches mathematics. She's excited to learn every day!",
                author: "Sarah M.",
                role: "Parent"
              }, {
                quote: "An invaluable tool in my classroom. The students are more engaged and show improved problem-solving skills.",
                author: "Mr. Johnson",
                role: "Grade 3 Teacher"
              }].map((testimonial, index) => <div key={index} className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {testimonial.author[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary-700">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default Hero;
