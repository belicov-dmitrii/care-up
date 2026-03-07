/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Med, MedForm, MedUnit } from '@/types';

function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const medNames = [
    'Paracetamol',
    'Ibuprofen',
    'Magnesium',
    'Vitamin D3',
    'Iron',
    'Aspirin',
    'Melatonin',
    'Zinc',
];

export function generateRandomMed(): Partial<Omit<Med, 'id'>> & { name: string } {
    const base: Omit<Med, 'id'> = {
        name: randomFromArray(medNames),
        form: randomFromArray(Object.values(MedForm)),
        strength: randomNumber(1, 1000),
        unit: randomFromArray(Object.values(MedUnit)),
        dose: randomNumber(1, 5),
        remaining: randomNumber(0, 100),
        quantity: randomNumber(10, 500),
    };

    const optionalKeys: (keyof Omit<Med, 'id' | 'name'>)[] = [
        'form',
        'strength',
        'unit',
        'dose',
        'remaining',
        'quantity',
    ];

    const count = randomNumber(3, optionalKeys.length);

    const shuffled = [...optionalKeys].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    const result: any & { name: string } = {
        name: base.name,
    };

    for (const key of selected) {
        result[key] = base[key];
    }

    return result;
}
