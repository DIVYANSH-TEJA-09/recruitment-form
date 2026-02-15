
"use client";

import FormHeader from '@/components/FormHeader';
import QuestionCard from '@/components/QuestionCard';
import { CheckboxGroup } from '@/components/ui/CheckboxGroup';
import { Input } from '@/components/ui/Input';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Scale } from '@/components/ui/Scale';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { formStructure, Question, Section } from '@/data/form-structure';
import React, { useState } from 'react';

export default function Home() {
  // Define acceptable form values
  type FormValue = string | string[] | number;

  const [formData, setFormData] = useState<Record<string, FormValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle Input Changes
  const handleChange = (id: string, value: FormValue) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Check if a section should be visible
  const isSectionVisible = (section: Section) => {
    if (!section.condition) return true;
    return formData[section.condition.fieldId] === section.condition.value;
  };

  // Validate Form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    formStructure.forEach(section => {
      if (!isSectionVisible(section)) return; // Skip hidden sections

      section.questions.forEach(question => {
        if (question.required) {
          const value = formData[question.id];
          // Check for empty string, empty array, undefined, null
          const isEmpty =
            value === undefined ||
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0);

          if (isEmpty) {
            newErrors[question.id] = "This is a required question";
            isValid = false;
          }
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    console.log("Form Submitted:", formData);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-8 px-4 bg-[#f0ebf8]">
        <div className="max-w-[770px] mx-auto bg-white rounded-lg border border-gray-200 border-t-8 border-t-[#673ab7] shadow-sm p-8">
          <h1 className="text-3xl font-normal text-[#202124] mb-4">
            Dev Catalyst Recruitment Drive
          </h1>
          <p className="text-sm text-[#202124] mb-4">
            Your response has been recorded.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#673ab7] text-sm hover:underline font-medium"
          >
            Submit another response
          </button>
        </div>
        <div className="max-w-[770px] mx-auto mt-4 text-center">
          <p className="text-xs text-[#5f6368]">
            This content is neither created nor endorsed by Google. - Terms of Service - Privacy Policy
          </p>
          <p className="text-xl text-[#5f6368] font-semibold mt-2 opacity-50"> Google Forms </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-3 sm:py-8 px-2 sm:px-4">
      <FormHeader />

      <form onSubmit={handleSubmit} className="max-w-[770px] mx-auto">
        {formStructure.map((section) => (
          isSectionVisible(section) && (
            <div key={section.id} className="mb-4">
              {/* Section Header Logic */}
              {section.title !== "Basic Information" && (
                <div className="mb-4 pt-4 px-1">
                  <div className="bg-[#673ab7] text-white p-3 rounded-md shadow-sm inline-block min-w-[200px]">
                    <h2 className="text-lg font-medium">{section.title}</h2>
                  </div>
                  {section.description && (
                    <p className="text-sm text-[#5f6368] mt-2 ml-1 whitespace-pre-line">{section.description}</p>
                  )}
                </div>
              )}

              {section.questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  title={q.text}
                  required={q.required}
                  description={q.description}
                  error={errors[q.id]}
                >
                  {renderInput(q, formData, handleChange, errors)}
                </QuestionCard>
              ))}
            </div>
          )
        ))}

        <div className="flex justify-between items-center px-4 mt-8 pb-12">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#673ab7] text-white px-6 py-2 rounded-[4px] font-medium text-sm hover:bg-[#5e35b1] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" className="text-[#673ab7] text-sm font-medium hover:bg-purple-50 px-3 py-2 rounded">Clear form</button>
        </div>
      </form>
      <div className="max-w-[770px] mx-auto mt-4 text-center pb-8">
        <p className="text-xs text-[#5f6368]">
          This content is neither created nor endorsed by Google. - Terms of Service - Privacy Policy
        </p>
        <p className="text-xl text-[#5f6368] font-semibold mt-2 opacity-50"> Google Forms </p>
      </div>
    </div>
  );
}

// Helper to render specific input types
function renderInput(
  q: Question,
  formData: Record<string, string | string[] | number>,
  handleChange: (id: string, val: string | string[] | number) => void,
  errors: Record<string, string>
) {
  const value = formData[q.id] !== undefined ? formData[q.id] : (q.type === 'checkbox' ? [] : "");

  switch (q.type) {
    case 'text':
      return (
        <Input
          type="text"
          value={value as string}
          onChange={(e) => handleChange(q.id, e.target.value)}
          placeholder="Your answer"
          error={!!errors[q.id]}
        />
      );
    case 'textarea':
    case 'ranking':
      return (
        <Textarea
          value={value as string}
          onChange={(e) => handleChange(q.id, e.target.value)}
          placeholder="Your answer"
          error={!!errors[q.id]}
        />
      );
    case 'radio':
      return (
        <RadioGroup
          name={q.id}
          options={q.options || []}
          value={value as string}
          onChange={(val) => handleChange(q.id, val)}
          error={!!errors[q.id]}
        />
      );
    case 'checkbox':
      return (
        <CheckboxGroup
          name={q.id}
          options={q.options || []}
          value={value as string[]}
          onChange={(val) => handleChange(q.id, val)}
          error={!!errors[q.id]}
        />
      );
    case 'select':
      return (
        <Select
          options={q.options || []}
          value={value as string}
          onChange={(e) => handleChange(q.id, e.target.value)}
          error={!!errors[q.id]}
        />
      );
    case 'scale':
      return (
        <Scale
          name={q.id}
          min={q.min || 1}
          max={q.max || 5}
          minLabel={q.minLabel}
          maxLabel={q.maxLabel}
          value={value as number}
          onChange={(val) => handleChange(q.id, val)}
          error={!!errors[q.id]}
        />
      );
    default:
      return null;
  }
}
