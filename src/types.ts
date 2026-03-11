// ===== Enums: Meds =====

import { type Symptoms } from './utils/consts';

export enum MedForm {
    Tablets = 'Tablets',
    FilmCoatedTablets = 'Film-coated tablets',
    EntericCoatedTablets = 'Enteric-coated tablets',
    ChewableTablets = 'Chewable tablets',
    OrallyDisintegratingTabletsODT = 'Orally disintegrating tablets (ODT)',
    SublingualTabletsUnderTongue = 'Sublingual tablets (under tongue)',
    Capsules = 'Capsules',
    Caplets = 'Caplets',
    Powders = 'Powders',
    Granules = 'Granules',
    MedicinalChewingGum = 'Medicinal chewing gum',
    Pastilles = 'Pastilles',
    Solutions = 'Solutions',
    Syrups = 'Syrups',
    Suspensions = 'Suspensions',
    Emulsions = 'Emulsions',
    Elixirs = 'Elixirs',
    OralDrops = 'Oral drops',
}

export enum MedUnit {
    Mg = 'mg',
    Mcg = 'mcg',
    G = 'g',
    MEq = 'mEq',
    Mmol = 'mmol',
    Units = 'units',
    IU = 'IU',
    Drops = 'Drops',
    Teaspoon = 'Teaspoon',
    Tablespoon = 'Tablespoon',
    Ml = 'mL',
    L = 'L',
}

export type Med = {
    id: string; // uniq
    userId: string;
    name: string;
    form: MedForm;
    strength: number;
    unit: MedUnit;
    dose: number;
    remaining: number;
    expirationDate: string | undefined;
    quantity: number;
};
// ===== Enums: Schedule =====

export enum ScheduleType {
    EveryDay = 'every day',
    EveryOtherDay = 'every other day',
    EveryWeek = 'every week',
    EveryMonth = 'every month',
    SpecificDate = 'specific date',
}

export enum RestrictionType {
    FoodDrinkTiming = 'Food & Drink Timing',
    SupplementMineralSeparation = 'Supplement / Mineral Separation',
    OtherMedicationSpacing = 'Other Medication Spacing',
    PostureImmediateBehavior = 'Posture / Immediate Behavior',
    ActivityTimeLimited = 'Activity (Time-Limited)',
}

export enum RecommendationCategory {
    ActivityRestrictions = 'Activity Restrictions',
    SubstanceRestrictions = 'Substance Restrictions',
    FoodDiet = 'Food & Diet',
    AdministrationMethod = 'Administration Method',
    HealthConditionWarnings = 'Health Condition Warnings',
    StorageInstructions = 'Storage Instructions',
}

// ===== Types: Schedule =====

export type ScheduleTime = {
    id: string;
    hours: number; // < 24
    minutes: number; // < 61
};

export type ScheduleRestriction = {
    type: RestrictionType;
    note: string;
    before: number | null; // minutes
    after: number | null; // minutes
    enabled: boolean;
};

export type ScheduleRecommendation = {
    id: string;
    category: RecommendationCategory;
    title: string;
    note: string;
};

export type ScheduleItem = {
    id: string;
    medId: string; // FK -> Med.id
    userId: string;
    type: ScheduleType;
    time: Array<ScheduleTime>;
    startDate: string; // date (ISO: YYYY-MM-DD)
    dose: Record<string, number>; // key FK -> ScheduleTime.id
    endDate: string; // date (ISO: YYYY-MM-DD)
    restriction: ScheduleRestriction[];
    recommendations: ScheduleRecommendation[];
};

export type UserData = {
    id: string;
    name: string;
    email: string;
    sex: 'M' | 'F';
    age: number;
    height: number;
    weight: number;
    pregnant: boolean;
    breastfeeding: boolean;
    smoking: boolean;
    drinking: boolean;
    allergies: Array<string>;
    diseases: Array<string>;
};

// ===== Types: Pharmacy =====

export enum MedStockStatus {
    Empty = 'Empty',
    Expiring = 'Expiring',
    Low = 'Low stock',
    Good = 'Good',
}

// ===== Types: Intake Events =====

export type SymptomsType = (typeof Symptoms)[number];

export interface IntakeEvent {
    id: string; // uniq
    userId: string;
    medId: string;
    medName: string;
    time: string;
    medStrenght: string;
    scheduleId: string;
    scheduleTimeId: string;
    eventDate: string;
    status: 'taken' | 'missed' | 'skipped';
    symptoms: Array<SymptomsType>;
    createdAt: string;
    updatedAt: string | null;
}
