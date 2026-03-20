import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/analyze/route';

// Mock the Gemini SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => JSON.stringify({
                severity: "High",
                summary: "Test summary indicating severe condition",
                actionSteps: ["Step 1: Administer oxygen"]
              })
            }
          })
        };
      }
    }
  };
});

describe('API Route /api/analyze', () => {
  it('returns formatted JSON effectively parsing the Gemini mock response', async () => {
    process.env.GEMINI_API_KEY = 'test-key-123';
    
    const mockFormData = new FormData();
    mockFormData.append('description', 'Patient is bleeding heavily');

    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: mockFormData
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.severity).toBe('High');
    expect(json.summary).toBe('Test summary indicating severe condition');
    expect(json.actionSteps.length).toBe(1);
    expect(json.actionSteps[0]).toBe('Step 1: Administer oxygen');
  });

  it('returns 400 Bad Request if no data is provided whatsoever', async () => {
    process.env.GEMINI_API_KEY = 'test-key-123';
    
    const mockFormData = new FormData(); 
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: mockFormData
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
