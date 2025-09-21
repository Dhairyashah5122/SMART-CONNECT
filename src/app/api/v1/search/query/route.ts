import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock search results based on the query
    const mockData = generateMockData(body.entity, body.page_size || 20);
    
    const searchResult = {
      data: mockData,
      total_count: 150, // Mock total
      page: body.page || 1,
      page_size: body.page_size || 20,
      total_pages: Math.ceil(150 / (body.page_size || 20)),
      execution_time_ms: Math.random() * 100 + 50, // Mock execution time
      aggregations: {
        avg_gpa: 3.4,
        total_active: 120,
        by_program: {
          "Computer Science": 45,
          "Business": 35,
          "Engineering": 40,
          "Other": 30
        }
      }
    };

    return NextResponse.json(searchResult);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process search query' },
      { status: 500 }
    );
  }
}

function generateMockData(entity: string, count: number) {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    switch (entity) {
      case 'students':
        data.push({
          id: 1000 + i,
          first_name: `Student${i + 1}`,
          last_name: `Lastname${i + 1}`,
          email: `student${i + 1}@westcliff.edu`,
          student_id_number: `WU${(20240000 + i).toString()}`,
          gpa: (3.0 + Math.random() * 1.0).toFixed(2),
          program: ['Computer Science', 'Business', 'Engineering'][i % 3],
          status: 'Active',
          skills: JSON.stringify(['JavaScript', 'Python', 'React']),
          created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
        break;
      
      case 'mentors':
        data.push({
          id: 2000 + i,
          first_name: `Mentor${i + 1}`,
          last_name: `Expert${i + 1}`,
          email: `mentor${i + 1}@company.com`,
          company: ['TechCorp', 'InnovateInc', 'StartupXYZ'][i % 3],
          expertise: ['Software Development', 'Data Science', 'Product Management'][i % 3],
          status: 'Active',
          created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
        break;
      
      case 'projects':
        data.push({
          id: 3000 + i,
          name: `Project ${i + 1}`,
          description: `This is a sample project description for project ${i + 1}`,
          company: ['TechCorp', 'InnovateInc', 'StartupXYZ'][i % 3],
          mentor: `Mentor${i + 1} Expert${i + 1}`,
          status: ['Active', 'Planning', 'Completed'][i % 3],
          requirements: 'React, Node.js, PostgreSQL',
          created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
        break;
      
      case 'companies':
        data.push({
          id: 4000 + i,
          name: `Company ${i + 1}`,
          description: `Technology company specializing in innovation`,
          industry: ['Technology', 'Finance', 'Healthcare'][i % 3],
          size: ['Small (1-50)', 'Medium (51-200)', 'Large (200+)'][i % 3],
          location: ['Los Angeles, CA', 'San Francisco, CA', 'New York, NY'][i % 3],
          contact_email: `contact@company${i + 1}.com`,
          created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
        break;
      
      default:
        data.push({
          id: 5000 + i,
          name: `Item ${i + 1}`,
          description: `Sample item ${i + 1}`,
          status: 'Active',
          created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
  }
  
  return data;
}
