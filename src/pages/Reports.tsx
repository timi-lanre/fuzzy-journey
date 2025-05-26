import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { ReportsHeader } from '@/components/ReportsHeader';
import { ReportListsView } from '@/components/ReportListsView';
import { ReportAdvisorsView } from '@/components/ReportAdvisorsView';

const ADVISORS_PER_PAGE = 50;

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

export default function Reports() {
  const { user } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReportName, setSelectedReportName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('first_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Fetch user's reports
  const { data: reports = [] } = useQuery({
    queryKey: ['reports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Get selected report data
  const selectedReport = reports.find(r => r.id === selectedReportId);

  // Fetch advisors for selected report with pagination and sorting
  const { data: reportAdvisors = [] } = useQuery({
    queryKey: ['report-advisors', selectedReportId, currentPage, sortField, sortDirection],
    queryFn: async () => {
      if (!selectedReportId || !selectedReport?.advisor_ids) return [];
      
      const startIndex = (currentPage - 1) * ADVISORS_PER_PAGE;
      const endIndex = startIndex + ADVISORS_PER_PAGE;
      const advisorIdsForPage = selectedReport.advisor_ids.slice(startIndex, endIndex);
      
      if (advisorIdsForPage.length === 0) return [];
      
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .in('id', advisorIdsForPage)
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedReportId && !!selectedReport?.advisor_ids,
  });

  const handleSelectReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    setSelectedReportId(reportId);
    setSelectedReportName(report?.name || '');
    setCurrentPage(1);
  };

  const handleBackToReports = () => {
    setSelectedReportId(null);
    setSelectedReportName('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const totalCount = selectedReport?.advisor_ids?.length || 0;
  const totalPages = Math.ceil(totalCount / ADVISORS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#E5D3BC]">
      <ReportsHeader />

      {/* Main Content - Wider container */}
      <main className="px-4 lg:px-8 py-8">
        <div className="max-w-[1600px] mx-auto">
          {!selectedReportId ? (
            <ReportListsView
              reports={reports}
              onSelectReport={handleSelectReport}
            />
          ) : (
            <ReportAdvisorsView
              selectedReportId={selectedReportId}
              selectedReportName={selectedReportName}
              advisors={reportAdvisors}
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onBackToReports={handleBackToReports}
              onPageChange={handlePageChange}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          )}
        </div>
      </main>
    </div>
  );
}
