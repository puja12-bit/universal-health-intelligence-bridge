import { NextRequest } from 'next/server';
import { handleAnalyzeRoute } from '@/routes/analyze';

// Running on Google Cloud Run natively
export async function POST(req: NextRequest) {
  return handleAnalyzeRoute(await req.formData());
}
