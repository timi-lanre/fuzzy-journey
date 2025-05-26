
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { Table, TableBody } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdvisorTableHeader } from '@/components/AdvisorTableHeader';
import { ReportAdvisorTableRow } from '@/components/ReportAdvisorTableRow';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

interface Advisor {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  firm: string | null;
  branch: string | null;
  team_name: string | null;
  city: string | null;
  province: string | null;
  email: string | null;
  linkedin_url: string | null;
  website_url: string | null;
}

interface ReportAdvisorsViewProps {
  selectedReportId: string;
  selectedReportName: string;
  advisors: Advisor[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onBackToReports: () => void;
  onPageChange: (page: number) => void;
  onSort: (field: SortField) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export function ReportAdvisorsView({ 
  selectedReportId, 
  selectedReportName, 
  advisors, 
  currentPage,
  totalPages,
  totalCount,
  onBackToReports,
  onPageChange,
  onSort,
  sortField,
  sortDirection
}: ReportAdvisorsViewProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={onBackToReports}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{selectedReportName}</h2>
        <p className="text-slate-600">
          {totalCount} advisor{totalCount !== 1 ? 's' : ''}
        </p>
      </div>

      {advisors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No advisors in this report</h3>
          <p className="text-slate-600">This report appears to be empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="relative">
              {/* Sticky Header */}
              <div className="sticky top-0 z-30 bg-white border-b-2 border-slate-200">
                <Table>
                  <AdvisorTableHeader 
                    onSort={onSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </Table>
              </div>
              
              {/* Scrollable Content */}
              <ScrollArea className="h-[640px] w-full">
                <Table>
                  <TableBody>
                    {advisors.map((advisor) => (
                      <ReportAdvisorTableRow
                        key={advisor.id}
                        advisor={advisor}
                      />
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) onPageChange(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageNumber);
                          }}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) onPageChange(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
