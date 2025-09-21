import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity') || 'students';
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock quick search results
    const mockData = generateQuickSearchData(entity, query, limit);
    
    const searchResult = {
      data: mockData,
      total_count: mockData.length,
      page: 1,
      page_size: limit,
      total_pages: 1,
      execution_time_ms: Math.random() * 50 + 10,
      search_query: query,
      entity: entity
    };

    return NextResponse.json(searchResult);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process quick search' },
      { status: 500 }
    );
  }
}

function generateQuickSearchData(entity: string, query: string, limit: number) {
  const data = [];
  
  for (let i = 0; i < Math.min(limit, 10); i++) {
    switch (entity) {
      case 'students':
        data.push({
          id: 1000 + i,
          first_name: query ? `${query}${i + 1}` : `Student${i + 1}`,
          last_name: `Lastname${i + 1}`,
          email: `${query || 'student'}${i + 1}@westcliff.edu`,
          student_id_number: `WU${(20240000 + i).toString()}`,
          gpa: (3.0 + Math.random() * 1.0).toFixed(2),
          program: ['Computer Science', 'Business', 'Engineering'][i % 3],
          status: 'Active'
        });
        break;
      
      case 'mentors':
        data.push({
          id: 2000 + i,
          first_name: query ? `${query}${i + 1}` : `Mentor${i + 1}`,
          last_name: `Expert${i + 1}`,
          email: `${query || 'mentor'}${i + 1}@company.com`,
          company: ['TechCorp', 'InnovateInc', 'StartupXYZ'][i % 3],
          expertise: ['Software Development', 'Data Science', 'Product Management'][i % 3],
          status: 'Active'
        });
        break;
      
      case 'projects':
        data.push({
          id: 3000 + i,
          name: query ? `${query} Project ${i + 1}` : `Project ${i + 1}`,
          description: `Sample project matching search: ${query}`,
          company: ['TechCorp', 'InnovateInc', 'StartupXYZ'][i % 3],
          status: ['Active', 'Planning', 'Completed'][i % 3],
          requirements: 'React, Node.js, PostgreSQL'
        });
        break;
      
      case 'companies':
        data.push({
          id: 4000 + i,
          name: query ? `${query} Corp ${i + 1}` : `Company ${i + 1}`,
          description: `Technology company specializing in ${query || 'innovation'}`,
          industry: ['Technology', 'Finance', 'Healthcare'][i % 3],
          size: ['Small (1-50)', 'Medium (51-200)', 'Large (200+)'][i % 3],
          location: ['Los Angeles, CA', 'San Francisco, CA', 'New York, NY'][i % 3]
        });
        break;
      
      default:
        data.push({
          id: 5000 + i,
          name: query ? `${query} ${i + 1}` : `Item ${i + 1}`,
          description: `Sample item matching: ${query}`,
          status: 'Active'
        });
    }
  }
  
  return data;
}
