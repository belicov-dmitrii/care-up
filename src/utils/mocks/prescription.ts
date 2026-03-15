import { RecommendationCategory, RestrictionType, type PrescriptionItem } from '@/types';
import { getRandomInt } from '../getRandomInt';
import { generateRandomMed } from '../generateRandomMed';

export const generatePrescriptionItems = (): Array<PrescriptionItem> => {
    return [...new Array(getRandomInt(1, 5))].map(() => {
        const medData = generateRandomMed();

        const [firstTimeId, secondTimeId] = [crypto.randomUUID(), crypto.randomUUID()];

        return {
            medData,
            id: crypto.randomUUID(),
            name: medData.name,
            medId: null,
            scheduleId: null,
            scheduleData: {
                time: [
                    {
                        id: firstTimeId,
                        hours: getRandomInt(1, 15),
                        minutes: getRandomInt(0, 59),
                    },
                    {
                        id: secondTimeId,
                        hours: getRandomInt(15, 23),
                        minutes: getRandomInt(0, 59),
                    },
                ],
                dose: {
                    [firstTimeId]: getRandomInt(1, 3),
                    [secondTimeId]: getRandomInt(1, 10),
                },
                restriction: [
                    {
                        type: RestrictionType.FoodDrinkTiming,
                        note: 'Avoid coffee before intake',
                        before: 120,
                        after: null,
                        enabled: true,
                    },
                ],
                recommendations: [
                    {
                        id: 'a9F3kLm8QxT2vR7zBn4P-1',
                        category: RecommendationCategory.ActivityRestrictions,
                        title: 'Avoid driving if dizziness occurs',
                        note: 'Taking with a meal increases absorption and helps prevent any stomach discomfort.',
                    },
                ],
            },
        };
    });
};
