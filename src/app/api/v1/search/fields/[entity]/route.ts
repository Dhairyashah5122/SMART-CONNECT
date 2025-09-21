import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  const { entity } = params;
  
  // Mock field data for different entities
  const mockFields = {
    students: [
      'id', 'first_name', 'last_name', 'email', 'student_id_number',
      'gpa', 'program', 'status', 'skills', 'created_at', 'updated_at'
    ],
    mentors: [
      'id', 'first_name', 'last_name', 'email', 'company', 'expertise',
      'status', 'created_at', 'updated_at'
    ],
    projects: [
      'id', 'name', 'description', 'company', 'mentor', 'status',
      'requirements', 'created_at', 'updated_at'
    ],
    companies: [
      'id', 'name', 'description', 'industry', 'size', 'location',
      'contact_email', 'created_at', 'updated_at'
    ],
    surveys: [
      'id', 'title', 'description', 'type', 'status', 'created_at',
      'updated_at'
    ],
    users: [
      'id', 'email', 'first_name', 'last_name', 'role', 'status',
      'created_at', 'updated_at'
    ],
    courses: [
      'id', 'name', 'code', 'description', 'instructor', 'credits',
      'semester', 'created_at', 'updated_at'
    ]
  };

  const fields = mockFields[entity as keyof typeof mockFields] || [];

  return NextResponse.json({
    entity,
    fields,
    success: true
  });
}
