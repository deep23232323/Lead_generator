import { useEffect, useState, useCallback } from "react";
import { leadService } from "../services/lead.service";
import type { Lead, LeadFilters } from "../types/lead";
import { useAuthStore } from "../store/auth.store";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Download, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { LeadDialog } from "../components/leads/LeadDialog";

export const Leads = () => {
  const { user } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const [filters, setFilters] = useState<LeadFilters>({
    limit: 10,
    page: 1,
    sortBy: "latest"
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const activeFilters = { ...filters, page, search: debouncedSearchTerm };
      
      Object.keys(activeFilters).forEach(key => {
        if (activeFilters[key as keyof LeadFilters] === "all" || activeFilters[key as keyof LeadFilters] === "") {
          delete activeFilters[key as keyof LeadFilters];
        }
      });
      
      const response = await leadService.getLeads(activeFilters);
      setLeads(response.leads);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, debouncedSearchTerm]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.source, filters.sortBy, debouncedSearchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await leadService.deleteLead(id);
        fetchLeads();
      } catch (error) {
        console.error("Failed to delete lead", error);
      }
    }
  };

  const handleExport = () => {
    // Generate CSV string
    const headers = ["Name", "Email", "Status", "Source", "Created At"];
    const csvContent = [
      headers.join(","),
      ...leads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${new Date(lead.createdAt).toLocaleDateString()}"`
      ].join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-amber-100 text-amber-800";
      case "qualified": return "bg-green-100 text-green-800";
      case "lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage and track your leads.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={leads.length === 0}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          {user?.role === "admin" && (
            <Button onClick={() => {
              setSelectedLead(null);
              setDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex-1">
          <Input 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select 
          value={filters.status || "all"} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, status: val as any }))}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.source || "all"} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, source: val as any }))}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.sortBy || "latest"} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, sortBy: val as any }))}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Created</TableHead>
              {user?.role === "admin" && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={user?.role === "admin" ? 6 : 5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={user?.role === "admin" ? 6 : 5} className="h-24 text-center">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{lead.source}</TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  {user?.role === "admin" && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedLead(lead);
                            setDialogOpen(true);
                          }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => handleDelete(lead._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * (filters.limit || 10)) + 1} to {Math.min(page * (filters.limit || 10), total)} of {total} results
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <LeadDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        lead={selectedLead}
        onSuccess={fetchLeads} 
      />
    </div>
  );
};
