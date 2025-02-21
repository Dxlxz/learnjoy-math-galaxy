import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const FAQSection = () => {
  return <div className="w-full max-w-4xl mb-16">
      <h2 className="text-3xl font-bold text-primary-600 mb-8 text-center">Ancient Scrolls of Knowledge</h2>
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl transform -rotate-1 bg-purple-500 hover:bg-purple-400"></div>
        <div className="relative p-8 backdrop-blur-sm rounded-2xl border-2 border-primary-200 shadow-xl bg-slate-50">
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
          }].map((item, index) => <AccordionItem key={index} value={`item-${index}`} className="border-b border-primary-200">
                <AccordionTrigger className="text-lg font-semibold text-primary-700 hover:text-primary-600">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </div>;
};
export default FAQSection;