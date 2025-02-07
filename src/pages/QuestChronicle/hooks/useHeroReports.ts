
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { HeroReport, ReportData } from '@/types/shared';

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
  const [reports, setReports] = useState<HeroReport[]>([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('hero_reports')
          .select('*')
          .eq('user_id', session.user.id)
          .order('generated_at', { ascending: false });

        if (error) throw error;

        const typedReports = (data as any[]).map(report => ({
          ...report,
          report_data: report.report_data as ReportData
        }));

        setReports(typedReports);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading reports",
          description: error instanceof Error ? error.message : "Failed to load hero reports",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [navigate, toast]);

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

      const { data: report, error: insertError } = await supabase
        .from('hero_reports')
        .insert({
          user_id: session.user.id,
          report_type: 'comprehensive',
          report_data: reportData
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const { data: allReports, error: fetchError } = await supabase
        .from('hero_reports')
        .select('*')
        .eq('user_id', session.user.id)
        .order('generated_at', { ascending: false });

      if (fetchError) throw fetchError;

      const typedReports = (allReports as any[]).map(report => ({
        ...report,
        report_data: report.report_data as ReportData
      }));

      setReports(typedReports);
      
      toast({
        title: "Hero Report Generated!",
        description: "Your latest achievement report is ready to view.",
      });
    } catch (error) {
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
