"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Search, Filter, Download, TrendingUp, Users, Building, GraduationCap } from 'lucide-react';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import AdvancedFilters from '@/components/search/AdvancedFilters';
import { SearchResult } from '@/lib/types';

export default function DataMiningDashboard() {
  const [selectedEntity, setSelectedEntity] = useState('students');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  const entityStats = [
    {
      name: 'Students',
      value: 'students',
      icon: <GraduationCap className="h-6 w-6" />,
      count: '1,234',
      color: 'bg-blue-500'
    },
    {
      name: 'Mentors',
      value: 'mentors',
      icon: <Users className="h-6 w-6" />,
      count: '456',
      color: 'bg-green-500'
    },
    {
      name: 'Projects',
      value: 'projects',
      icon: <Building className="h-6 w-6" />,
      count: '789',
      color: 'bg-purple-500'
    },
    {
      name: 'Companies',
      value: 'companies',
      icon: <Building className="h-6 w-6" />,
      count: '123',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Mining & Search</h1>
          <p className="text-muted-foreground">
            Advanced search, filtering, and data extraction tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {entityStats.map(stat => (
          <Card 
            key={stat.value} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedEntity === stat.value ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedEntity(stat.value)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Results */}
        <div className="lg:col-span-2 space-y-6">
          <AdvancedSearch 
            onResultsChange={setSearchResults}
          />
          {/* Analytics Summary */}
          {searchResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Search Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {searchResults.total_count}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Results</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {searchResults.execution_time_ms.toFixed(1)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Query Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {searchResults.page}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Page</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {searchResults.total_pages}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Pages</div>
                  </div>
                </div>

                {/* Aggregations */}
                {searchResults.aggregations && Object.keys(searchResults.aggregations).length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-3">Aggregations</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(searchResults.aggregations).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            {key.replace('_', ' ')}:
                          </span>
                          <span className="text-sm font-medium">
                            {typeof value === 'number' ? value.toFixed(2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <AdvancedFilters 
            entity={selectedEntity}
            onFiltersChange={() => {}}
          />
        </div>
      </div>

      {/* Tabs for Different Views */}
      <Card>
        <CardHeader>
          <CardTitle>Data Mining Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
              <TabsTrigger value="filters">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-6">
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Search</h3>
                <p className="text-muted-foreground">
                  Use the search interface above to perform advanced queries with filtering, sorting, and aggregation.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="mt-6">
              <div className="text-center py-8">
                <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Filtering</h3>
                <p className="text-muted-foreground">
                  Apply sophisticated filters using the sidebar to narrow down your search results.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="export" className="mt-6">
              <div className="text-center py-8">
                <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Data Export</h3>
                <p className="text-muted-foreground">
                  Export your search results in various formats including JSON, CSV, Excel, and PDF.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Data Analytics</h3>
                <p className="text-muted-foreground">
                  View search performance metrics and data aggregations in the results section above.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}