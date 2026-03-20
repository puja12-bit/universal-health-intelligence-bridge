import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PatientInput } from '../components/PatientInput';

describe('PatientInput Component', () => {
  it('renders input area and allows text input', () => {
    const mockSubmit = vi.fn();
    render(<PatientInput onDataSubmit={mockSubmit} />);

    const textArea = screen.getByLabelText(/Clinical Log \/ Symptoms/i);
    expect(textArea).toBeDefined();

    fireEvent.change(textArea, { target: { value: 'High fever and chill' } });
    expect((textArea as HTMLTextAreaElement).value).toBe('High fever and chill');
  });

  it('calls onDataSubmit when submit button is clicked with text', () => {
    const mockSubmit = vi.fn();
    render(<PatientInput onDataSubmit={mockSubmit} />);

    const textArea = screen.getByLabelText(/Clinical Log \/ Symptoms/i);
    fireEvent.change(textArea, { target: { value: 'Patient is experiencing severe headaches.' } });

    const submitBtn = screen.getByRole('button', { name: /Run Systems Analysis/i });
    fireEvent.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith('Patient is experiencing severe headaches.', null, '');
  });
});
