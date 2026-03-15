import { type MedForm } from '@/types';
import { type typedObjectKeys } from './typedObjectKeys';

type FORM_KEYS = ReturnType<typeof typedObjectKeys<typeof MedForm>>;

const TABLETS_ITEMS: FORM_KEYS = [
    'Tablets',
    'FilmCoatedTablets',
    'EntericCoatedTablets',
    'ChewableTablets',
    'OrallyDisintegratingTabletsODT',
    'SublingualTabletsUnderTongue',
];

const UNITS_ITEMS: FORM_KEYS = [
    'Capsules',
    'Caplets',
    'Granules',
    'MedicinalChewingGum',
    'Pastilles',
];

const LIQUID_ITEMS: FORM_KEYS = [
    'Solutions',
    'Syrups',
    'Suspensions',
    'Emulsions',
    'Elixirs',
    'OralDrops',
];

const POWDERS_ITEMS: FORM_KEYS = ['Powders', 'Solutions'];

const DOSE_UNIT = {
    tablets: {
        single: 'tablet',
        multiple: 'tablets',
    },
    powders: {
        single: 'mg',
        multiple: 'mg',
    },
    liquid: {
        single: 'mL',
        multiple: 'mL',
    },
    units: {
        single: 'unit',
        multiple: 'units',
    },
};

export const getMedFormToDoseUnit = (unit?: MedForm, dose?: number) => {
    const doseUnit = getDoseUnit(unit as FORM_KEYS[number]);

    return dose === 1 ? doseUnit.single : doseUnit.multiple;
};

const getDoseUnit = (unit?: FORM_KEYS[number]) => {
    if (!unit) {
        return DOSE_UNIT.tablets;
    }

    if (TABLETS_ITEMS.includes(unit)) {
        return DOSE_UNIT.tablets;
    }

    if (UNITS_ITEMS.includes(unit)) {
        return DOSE_UNIT.units;
    }

    if (LIQUID_ITEMS.includes(unit)) {
        return DOSE_UNIT.liquid;
    }

    if (POWDERS_ITEMS.includes(unit)) {
        return DOSE_UNIT.powders;
    }

    return DOSE_UNIT.tablets;
};
