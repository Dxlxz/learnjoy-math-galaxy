
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useSafeQuery } from '@/hooks/use-safe-query';
import { HeroReport, ReportData } from '../types';

export const useHeroReports = (
  achievements: number,
  totalQuests: number,
  averageScore: number,
  completionRate: number,
  categoryData: any[],
  performanceData: any[]
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generatingReport, setGeneratingReport] = useState(false);

  const { data: reports = [], isLoading: loading } = useSafeQuery<HeroReport[]>({
    queryKey: ['hero-reports'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('hero_reports')
        .select('*')
        .eq('user_id', session.user.id)
        .order('generated_at', { ascending: false });

      if (error) throw error;

      return (data as unknown as HeroReport[]) || [];
    },
    errorMessage: "Failed to load hero reports"
  });

  const generateReport = async () => {
    try {
      setGeneratingReport(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const reportData: ReportData = {
        achievements,
        totalQuests,
        averageScore,
        completionRate,
        strengths: categoryData
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .map(c => c.name),
        areasForImprovement: categoryData
          .sort((a, b) => a.value - b.value)
          .slice(0, 3)
          .map(c => c.name),
        recentProgress: performanceData.slice(-5).map(p => ({
          date: p.period,
          score: p.avgScore
        }))
      };

      const { error: insertError } = await supabase
        .from('hero_reports')
        .insert({
          user_id: session.user.id,
          report_type: 'comprehensive',
          report_data: reportData
        });

      if (insertError) {
        console.error('Error generating report:', insertError);
        throw new Error(insertError.message);
      }
      
      toast({
        title: "Hero Report Generated!",
        description: "Your latest achievement report is ready to view.",
      });

      // Invalidate the reports query to trigger a refresh
      window.location.reload();
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        variant: "destructive",
        title: "Error generating report",
        description: error instanceof Error ? error.message : "Failed to generate hero report",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  return {
    reports,
    generatingReport,
    loading,
    generateReport
  };
};
