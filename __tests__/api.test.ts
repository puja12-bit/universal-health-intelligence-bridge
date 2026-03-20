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
                condition: "Myocardial Infarction Simulation",
                confidence: 0.99,
                confidence_reason: "Test matching condition",
                risk_factors: ["Risk A"],
                recommended_actions: ["Action A"],
                required_resources: ["Resource A"],
                similar_cases: ["Case A"],
                procedure: ["Step 1: Administer oxygen"],
                videos: ["http://test.com"],
                data_sources: ["Test Source"],
                processing_steps: ["Test Processing"]
              })
            }
          })
        };
      }
    }
  };
});

describe('API Route /api/analyze', () => {
  it('returns rigorous JSON matching the exact UHIB schema parsed from Gemini', async () => {
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
    expect(json.condition).toBe('Myocardial Infarction Simulation');
    expect(json.confidence_reason).toBe('Test matching condition');
    expect(json.procedure.length).toBe(1);
    expect(json.procedure[0]).toBe('Step 1: Administer oxygen');
  });

  it('guarantees zero crashes by returning 200 OK Fallback JSON on empty input', async () => {
    process.env.GEMINI_API_KEY = 'test-key-123';
    
    const mockFormData = new FormData(); 
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: mockFormData
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    
    const json = await res.json();
    expect(json.severity).toBe('Low');
    expect(json.condition).toBe('No Data Provided');
    expect(json.confidence_reason).toBe('Input was completely empty. Awaiting valid telemetry.');
  });
});
