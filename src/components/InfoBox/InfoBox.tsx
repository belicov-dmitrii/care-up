import { PALETTE } from '@/utils/theme/colors';
import { alpha, Box, Paper, Stack, Typography } from '@mui/material';
import { type FC } from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { RecommendationCategory } from '@/types';

export const iconByCategory: Record<RecommendationCategory, typeof RestaurantIcon> = {
    [RecommendationCategory.AdministrationMethod]: RestaurantIcon,
    [RecommendationCategory.ActivityRestrictions]: RestaurantIcon,
    [RecommendationCategory.FoodDiet]: RestaurantIcon,
    [RecommendationCategory.HealthConditionWarnings]: RestaurantIcon,
    [RecommendationCategory.StorageInstructions]: RestaurantIcon,
    [RecommendationCategory.SubstanceRestrictions]: RestaurantIcon,
};

interface IInfoBoxProps {
    title: string;
    note?: string;
    category: RecommendationCategory;
}

export const InfoBox: FC<IInfoBoxProps> = ({ title, note, category }) => {
    const Icon = iconByCategory[category];

    return (
        <Paper
            sx={{
                display: 'flex',
                backgroundColor: PALETTE.BRAND_WHITE,
                padding: 3,
                borderRadius: '22px',
                textAlign: 'left',
                gap: 2,
            }}
        >
            <Box
                className="icon-container"
                sx={{
                    fontSize: 24,
                    backgroundColor: alpha(PALETTE.SUCCESS, 0.1),
                    color: PALETTE.SUCCESS,
                }}
            >
                <Icon />
            </Box>
            <Stack gap={1}>
                <Typography variant="h3" sx={{ fontSize: 18, fontWeight: 600 }}>
                    {title}
                </Typography>
                <Typography variant="body2" fontSize={15}>
                    {note}
                </Typography>
            </Stack>
        </Paper>
    );
};
