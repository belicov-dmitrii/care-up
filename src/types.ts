// ===== Enums: Meds =====

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
    expirationDate: string;
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
    category: RecommendationCategory;
    text: string;
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
    recommendation: ScheduleRecommendation;
};

export type UserData = {
    id: string;
    name: string;
    email: string;
};
