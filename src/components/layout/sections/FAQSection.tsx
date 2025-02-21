
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What ages is Math Mentor suitable for?",
      answer: "Math Mentor is designed for students from Kindergarten through Grade 5 (ages 5-11). Each grade level has specially tailored content and adventures!"
    },
    {
      question: "How does the adaptive learning work?",
      answer: "Our system adjusts to your child's learning pace and style. As they complete quests, the difficulty and type of problems adapt to ensure the perfect learning challenge."
    },
    {
      question: "Can parents track their child's progress?",
      answer: "Yes! Parents receive detailed progress reports and can follow their child's learning journey through our Quest Chronicle feature."
    },
    {
      question: "Is Math Mentor aligned with school curriculum?",
      answer: "Absolutely! Our content is aligned with common core standards and supplements regular school curriculum perfectly."
    },
    {
      question: "How often should my child use Math Mentor?",
      answer: "We recommend 15-30 minutes per day, 3-5 times per week for optimal learning results. However, the platform is flexible to fit your schedule!"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-primary-600">Frequently Asked Questions</h2>
          </div>
          <p className="text-xl text-gray-600">Everything you need to know about your math adventure</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium hover:text-primary-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
