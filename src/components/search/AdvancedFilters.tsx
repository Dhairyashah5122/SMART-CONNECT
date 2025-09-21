"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Filter, X, ChevronDown, Star, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { FilterDefinition, FilterGroup, FilterPreset, FilterCondition } from '@/lib/types';

interface AdvancedFiltersProps {
  entity: string;
  onFiltersChange: (filters: FilterCondition[]) => void;
  className?: string;
}

export default function AdvancedFilters({ entity, onFiltersChange, className }: AdvancedFiltersProps) {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['basic']));
  const [loading, setLoading] = useState(false);

  // Fetch filter definitions when entity changes
  useEffect(() => {
    const fetchFilterDefinitions = async () => {
      setLoading(true);
      try {
        const [definitionsResponse, presetsResponse] = await Promise.all([
          fetch(`/api/v1/filters/definitions/${entity}`),
          fetch(`/api/v1/filters/presets/${entity}`)
        ]);

        if (definitionsResponse.ok) {
          const definitionsData = await definitionsResponse.json();
          setFilterGroups(definitionsData.filter_groups || []);
        }

        if (presetsResponse.ok) {
          const presetsData = await presetsResponse.json();
          setFilterPresets(presetsData.presets || []);
        }
      } catch (error) {
        console.error('Failed to fetch filter definitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterDefinitions();
  }, [entity]);

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChange(activeFilters);
  }, [activeFilters, onFiltersChange]);

  const applyPreset = (preset: FilterPreset) => {
    setActiveFilters(preset.filters);
  };

  const addFilter = (filterDef: FilterDefinition) => {
    const newFilter: FilterCondition = {
      field: filterDef.field,
      operator: filterDef.default_operator,
      value: '',
      data_type: filterDef.field_type
    };

    setActiveFilters(prev => [...prev, newFilter]);
  };

  const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
    setActiveFilters(prev => prev.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const renderFilterInput = (filter: FilterCondition, index: number, filterDef: FilterDefinition) => {
    switch (filterDef.field_type) {
      case 'integer':
      case 'float':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Value"
              value={filter.value as string}
              onChange={(e) => updateFilter(index, { value: e.target.value })}
              min={filterDef.min_value}
              max={filterDef.max_value}
            />
            {filterDef.min_value !== undefined && filterDef.max_value !== undefined && (
              <div className="px-3">
                <Slider
                  value={[Number(filter.value) || filterDef.min_value]}
                  onValueChange={([value]) => updateFilter(index, { value: value.toString() })}
                  min={filterDef.min_value}
                  max={filterDef.max_value}
                  step={filterDef.field_type === 'float' ? 0.1 : 1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{filterDef.min_value}</span>
                  <span>{filterDef.max_value}</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'boolean':
        return (
          <Select 
            value={filter.value as string} 
            onValueChange={(value) => updateFilter(index, { value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'date':
      case 'datetime':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filter.value ? format(new Date(filter.value as string), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filter.value ? new Date(filter.value as string) : undefined}
                onSelect={(date) => updateFilter(index, { value: date?.toISOString() })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      default:
        if (filterDef.options && filterDef.options.length > 0) {
          return (
            <Select 
              value={filter.value as string} 
              onValueChange={(value) => updateFilter(index, { value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option..." />
              </SelectTrigger>
              <SelectContent>
                {filterDef.options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} {option.count && `(${option.count})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return (
          <Input
            placeholder="Enter value"
            value={filter.value as string}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
          />
        );
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">Loading filters...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Presets */}
      {filterPresets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4" />
              Quick Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filterPresets.map(preset => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="text-xs"
                >
                  {preset.display_name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4" />
                Active Filters ({activeFilters.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeFilters.map((filter, index) => {
                const filterDef = filterGroups
                  .flatMap(group => group.filters)
                  .find(def => def.field === filter.field);

                if (!filterDef) return null;

                return (
                  <div key={index} className="flex gap-3 items-start p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {filterDef.display_name}
                        </Badge>
                        <Select 
                          value={filter.operator} 
                          onValueChange={(value) => updateFilter(index, { operator: value as any })}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {filterDef.operators.map(op => (
                              <SelectItem key={op} value={op}>
                                {op.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {renderFilterInput(filter, index, filterDef)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4" />
            Available Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="groups" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="groups">By Category</TabsTrigger>
              <TabsTrigger value="all">All Fields</TabsTrigger>
            </TabsList>
            
            <TabsContent value="groups" className="space-y-3">
              {filterGroups.map(group => (
                <div key={group.name} className="border rounded-lg">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <span className="font-medium">{group.display_name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {group.filters.length}
                      </Badge>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${
                          expandedGroups.has(group.name) ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>
                  
                  {expandedGroups.has(group.name) && (
                    <div className="border-t p-3 space-y-2">
                      {group.filters.map(filterDef => {
                        const isActive = activeFilters.some(f => f.field === filterDef.field);
                        return (
                          <Button
                            key={filterDef.field}
                            variant={isActive ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => !isActive && addFilter(filterDef)}
                            disabled={isActive}
                            className="w-full justify-start text-left"
                          >
                            {filterDef.display_name}
                            {isActive && <Badge className="ml-auto">Active</Badge>}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filterGroups.flatMap(group => group.filters).map(filterDef => {
                  const isActive = activeFilters.some(f => f.field === filterDef.field);
                  return (
                    <Button
                      key={filterDef.field}
                      variant={isActive ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => !isActive && addFilter(filterDef)}
                      disabled={isActive}
                      className="justify-start text-left"
                    >
                      {filterDef.display_name}
                      {isActive && <Badge className="ml-auto">Active</Badge>}
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}