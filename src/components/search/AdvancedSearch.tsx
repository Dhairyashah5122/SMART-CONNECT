"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { SearchQuery, SearchResult, FilterCondition, ExportOptions, ExportFormat, SearchOperator, DataType } from '@/lib/types';

interface AdvancedSearchProps {
  className?: string;
  onResultsChange?: (results: SearchResult) => void;
}

const ENTITIES = [
  { value: 'students', label: 'Students' },
  { value: 'mentors', label: 'Mentors' },
  { value: 'projects', label: 'Projects' },
  { value: 'companies', label: 'Companies' },
  { value: 'surveys', label: 'Surveys' },
  { value: 'users', label: 'Users' },
  { value: 'courses', label: 'Courses' }
];

const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'between', label: 'Between' },
  { value: 'in', label: 'In List' },
  { value: 'is_null', label: 'Is Empty' },
  { value: 'is_not_null', label: 'Is Not Empty' }
];

export default function AdvancedSearch({ className, onResultsChange }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    entity: 'students',
    filters: [],
    search_text: '',
    search_fields: [],
    sort: [],
    page: 1,
    page_size: 20,
    include_relations: true,
    aggregate_functions: {}
  });

  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch available fields when entity changes
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch(`/api/v1/search/fields/${searchQuery.entity}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableFields(data.fields || []);
        }
      } catch (error) {
        console.error('Failed to fetch fields:', error);
      }
    };

    fetchFields();
  }, [searchQuery.entity]);

  const executeSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/search/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchQuery),
      });

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        onResultsChange?.(results);
      } else {
        console.error('Search failed:', response.statusText);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFilter = () => {
    const newFilter: FilterCondition = {
      field: availableFields[0] || '',
      operator: SearchOperator.EQUALS,
      value: '',
      data_type: DataType.STRING
    };

    setSearchQuery(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
    setSearchQuery(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, ...updates } : filter
      )
    }));
  };

  const removeFilter = (index: number) => {
    setSearchQuery(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const exportData = async (format: ExportFormat) => {
    if (!searchResults) return;

    setExportLoading(true);
    try {
      const exportOptions: ExportOptions = {
        format,
        include_headers: true,
        include_metadata: true,
        include_relations: false,
        flatten_json: true,
        compression: false
      };

      const response = await fetch('/api/v1/search/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          export_options: exportOptions
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Trigger download
        const link = document.createElement('a');
        link.href = `data:application/octet-stream;base64,${result.file_data}`;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const quickSearch = async (text: string) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/search/quick-search?entity=${searchQuery.entity}&q=${encodeURIComponent(text)}&limit=20`, {
        method: 'POST',
      });

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        onResultsChange?.(results);
      }
    } catch (error) {
      console.error('Quick search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search & Data Mining
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Entity Selection */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Select 
                value={searchQuery.entity} 
                onValueChange={(value) => setSearchQuery(prev => ({ ...prev, entity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity to search" />
                </SelectTrigger>
                <SelectContent>
                  {ENTITIES.map(entity => (
                    <SelectItem key={entity.value} value={entity.value}>
                      {entity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters ({searchQuery.filters.length})
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Quick Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Quick search..."
              value={searchQuery.search_text || ''}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, search_text: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchQuery.search_text && searchQuery.search_text.trim()) {
                    quickSearch(searchQuery.search_text);
                  } else {
                    executeSearch();
                  }
                }
              }}
              className="flex-1"
            />
            <Button onClick={executeSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Advanced Filters</h3>
                <Button variant="outline" size="sm" onClick={addFilter}>
                  Add Filter
                </Button>
              </div>

              {searchQuery.filters.map((filter, index) => (
                <div key={index} className="flex gap-2 items-center p-3 bg-white dark:bg-gray-800 rounded border">
                  <Select 
                    value={filter.field} 
                    onValueChange={(value) => updateFilter(index, { field: value })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map(field => (
                        <SelectItem key={field} value={field}>
                          {field.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filter.operator} 
                    onValueChange={(value) => updateFilter(index, { operator: value as any })}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Value"
                    value={filter.value as string}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    className="flex-1"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Search Results
                <Badge variant="secondary">
                  {searchResults.total_count} total
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Select onValueChange={(format) => exportData(format as ExportFormat)} disabled={exportLoading}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={exportLoading ? "Exporting..." : "Export"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {searchResults.data.length} of {searchResults.total_count} results 
              ({searchResults.execution_time_ms.toFixed(1)}ms)
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {searchResults.data.map((item, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                    {Object.entries(item).slice(0, 6).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          {key.replace('_', ' ')}:
                        </span>
                        <span className="text-right truncate max-w-32">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {searchResults.total_pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  disabled={searchQuery.page <= 1}
                  onClick={() => {
                    setSearchQuery(prev => ({ ...prev, page: prev.page - 1 }));
                    executeSearch();
                  }}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {searchResults.page} of {searchResults.total_pages}
                </span>
                <Button
                  variant="outline"
                  disabled={searchQuery.page >= searchResults.total_pages}
                  onClick={() => {
                    setSearchQuery(prev => ({ ...prev, page: prev.page + 1 }));
                    executeSearch();
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}