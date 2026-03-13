import { type AnalysisItem } from '@/types';

export const AnalysisItemPool: Array<Omit<AnalysisItem, 'id'>> = [
    {
        title: 'Hemoglobin',
        value: { amount: 125, unit: 'g/L' },
        referenceRange: { min: 120, max: 160, unit: 'g/L' },
        severity: 'normal',
        status: 'optimal',
        recommendations: [
            {
                category: 'notification',
                title: 'Indicator is within the normal range.',
            },
        ],
    },
    {
        title: 'Ferritin',
        value: { amount: 13, unit: 'ng/mL' },
        referenceRange: { min: 15, max: 150, unit: 'ng/mL' },
        severity: 'attention',
        status: 'requiresAction',
        recommendations: [
            {
                category: 'consult',
                title: 'Discuss iron stores with your doctor.',
            },
            {
                category: 'notification',
                title: 'Repeat ferritin test in 4–8 weeks if advised.',
            },
        ],
    },
    {
        title: 'Vitamin D (25-OH)',
        value: { amount: 21, unit: 'ng/mL' },
        referenceRange: { min: 30, max: 100, unit: 'ng/mL' },
        severity: 'attention',
        status: 'requiresAction',
        recommendations: [
            {
                category: 'consult',
                title: 'Consult a specialist about vitamin D correction.',
            },
        ],
    },
    {
        title: 'Glucose',
        value: { amount: 5.2, unit: 'mmol/L' },
        referenceRange: { min: 3.9, max: 5.5, unit: 'mmol/L' },
        severity: 'normal',
        status: 'optimal',
        recommendations: [
            {
                category: 'notification',
                title: 'Glucose is within the normal range.',
            },
        ],
    },
    {
        title: 'AST',
        value: { amount: 52, unit: 'U/L' },
        referenceRange: { min: 10, max: 40, unit: 'U/L' },
        severity: 'critical',
        status: 'requiresAction',
        recommendations: [
            {
                category: 'consult',
                title: 'Consult a doctor to review elevated AST.',
            },
        ],
    },
    {
        title: 'ALT',
        value: { amount: 34, unit: 'U/L' },
        referenceRange: { min: 7, max: 35, unit: 'U/L' },
        severity: 'normal',
        status: 'optimal',
        recommendations: [
            {
                category: 'notification',
                title: 'ALT is within the normal range.',
            },
        ],
    },
    {
        title: 'Platelets',
        value: { amount: 275, unit: '10^9/L' },
        referenceRange: { min: 150, max: 400, unit: '10^9/L' },
        severity: 'normal',
        status: 'optimal',
        recommendations: [
            {
                category: 'notification',
                title: 'Platelet count is stable.',
            },
        ],
    },
];
