import { PALETTE } from '@/utils/theme/colors';
import { alpha, Box, Paper, Stack, Typography } from '@mui/material';
import { type FC } from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { RecommendationCategory } from '@/types';
import { BoxIcon } from '../icons/BoxIcon';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const iconByCategory: Record<RecommendationCategory, typeof RestaurantIcon> = {
    [RecommendationCategory.AdministrationMethod]: RestaurantIcon,
    [RecommendationCategory.ActivityRestrictions]: RestaurantIcon,
    [RecommendationCategory.FoodDiet]: RestaurantIcon,
    [RecommendationCategory.HealthConditionWarnings]: RestaurantIcon,
    [RecommendationCategory.StorageInstructions]: BoxIcon as unknown as typeof RestaurantIcon,
    [RecommendationCategory.SubstanceRestrictions]: RestaurantIcon,
};

interface IInfoBoxProps {
    title: string;
    note?: string;
    category: RecommendationCategory;
    showArrow?: boolean;
}

export const InfoBox: FC<IInfoBoxProps> = ({ title, showArrow, note, category }) => {
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
            {showArrow && (
                <Box
                    sx={{
                        flex: '2 2',
                        textAlign: 'right',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        color: PALETTE.TEXT_SECONDARY,
                    }}
                >
                    <ArrowForwardIosIcon color="inherit" />
                </Box>
            )}
        </Paper>
    );
};
