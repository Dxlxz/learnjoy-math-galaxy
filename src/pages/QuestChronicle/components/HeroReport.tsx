
import React, { useRef } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Star, BookOpen, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HeroReport as HeroReportType } from '../types';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface HeroReportProps {
  report: HeroReportType;
}

export const HeroReport: React.FC<HeroReportProps> = ({ report }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!reportRef.current) return;

    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your report.",
      });

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`hero-report-${format(new Date(report.generated_at), 'yyyy-MM-dd')}.pdf`);

      toast({
        title: "Success!",
        description: "Your Hero Report has been downloaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-tr from-primary-50 to-white border-2 border-primary-100 shadow-lg" ref={reportRef}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800 mb-1">
            Hero Report - {format(new Date(report.generated_at), 'PPP')}
          </h3>
          <p className="text-sm text-primary-600/80">
            Generated at {format(new Date(report.generated_at), 'pp')}
          </p>
        </div>
        <Button 
          variant="outline" 
          className="ml-auto hover:bg-primary-50 transition-all duration-300"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4 text-primary-600" />
          Download PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-primary-100">
          <h4 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Achievements & Progress
          </h4>
          <div className="space-y-3">
            <div className="flex items-center text-primary-700">
              <Award className="h-5 w-5 mr-2 text-purple-500" />
              <span>Achievements Unlocked: {report.report_data.achievements}</span>
            </div>
            <div className="flex items-center text-primary-700">
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              <span>Total Quests Completed: {report.report_data.totalQuests}</span>
            </div>
            <div className="flex items-center text-primary-700">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Average Score: {report.report_data.averageScore.toFixed(1)}%</span>
            </div>
            <div className="flex items-center text-primary-700">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <span>Completion Rate: {report.report_data.completionRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-primary-100">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-primary-800 mb-2">Strengths</h4>
            <ul className="space-y-2">
              {report.report_data.strengths.map((strength, index) => (
                <li key={index} className="text-green-600 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-green-500" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-primary-800 mb-2">Areas for Growth</h4>
            <ul className="space-y-2">
              {report.report_data.areasForImprovement.map((area, index) => (
                <li key={index} className="text-blue-600 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white/50 rounded-xl p-6 shadow-sm border border-primary-100">
        <h4 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary-600" />
          Recent Progress
        </h4>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.report_data.recentProgress}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis 
                dataKey="date" 
                stroke="#6366F1"
                fontSize={12}
              />
              <YAxis 
                stroke="#6366F1"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ strokeWidth: 2, r: 4, fill: "white" }}
                activeDot={{ r: 6, fill: "#6366F1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
