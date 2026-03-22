'use client';

import { useState, type FC } from 'react';
import { type AnalysisItem } from '@/types';
import { type ANALYSIS_ITEM_RECOMMENDATIONS_STYLES } from '../utils/const';
import { Box, Button, Snackbar } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { NetworkRequest } from '@/utils/NetworkRequest';
import moment from 'moment';
import { useI18n } from '@/components/I18nProvider';
import { PALETTE } from '@/utils/theme/colors';

type stylesType = typeof ANALYSIS_ITEM_RECOMMENDATIONS_STYLES;

interface IProps {
    styles: stylesType[keyof stylesType];
    analysisItem: AnalysisItem;
    analysisId: string;
    status: 'ready' | 'review';
    recommendationIndex: number;
}

export const AnalysisItemAction: FC<IProps> = ({
    styles,
    analysisItem,
    analysisId,
    recommendationIndex,
    status,
}) => {
    const router = useRouter();
    const pathName = usePathname();
    const [snackbarMsg, setSnackBarMsg] = useState('');
    const { t } = useI18n();

    const onActionClick = async () => {
        try {
            switch (styles.action) {
                case 'linkToPharmacy':
                    router.push('/pharmacy');
                    break;
                case 'notificationRepeatTest':
                    await NetworkRequest(
                        'notifications/create',
                        {
                            text: `Repeat the ${analysisItem.title} test`,
                            url: pathName,
                            date: moment()
                                .add(2, 'weeks')
                                .set({
                                    hour: 15,
                                    minute: 0,
                                })
                                .utc()
                                .toISOString(),
                        },
                        { method: 'POST' }
                    );

                    setSnackBarMsg('You will be notified to repeat test in 2 weeks');
                    break;
                case 'notificationDoctor':
                    await NetworkRequest(
                        'notifications/create',
                        {
                            text: `Ask the doctor about the ${analysisItem.title} test`,
                            url: pathName,
                            date: moment()
                                .isoWeekday(8) // Next Monday
                                .set({
                                    hour: 15,
                                    minute: 0,
                                })
                                .utc()
                                .toISOString(),
                        },
                        { method: 'POST' }
                    );

                    setSnackBarMsg('You will be notified to ask your doctor next Monday');
                    break;
            }

            setTimeout(() => {
                onSkip();
            }, 1000);
        } catch (_) {}
    };

    const onSkip = async () => {
        const { ok } = await NetworkRequest(
            'analysis/complete-recommendation',
            {
                analysisId: analysisId,
                itemId: analysisItem.id,
                recommendationIndex: recommendationIndex,
            },
            { method: 'POST' }
        );

        if (ok) {
            router.refresh();
        }
    };

    if (status === 'ready') {
        return (
            <Box
                sx={{
                    borderRadius: '20px',
                    background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                    color: PALETTE.TEXT_SUCCESS,
                    p: '4px 10px',
                    minHeight: '40px',
                    width: '150px',
                    lineHeight: '40px',
                    textAlign: 'center',
                }}
            >
                {t('Completed')}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
                type="button"
                sx={{
                    borderRadius: '20px',
                    background: styles.container,
                    color: styles.text,
                    p: '4px 15px',
                    minHeight: '40px',
                    maxWidth: '200px',
                }}
                onClick={onActionClick}
            >
                {styles.title}
            </Button>
            <Button
                type="button"
                sx={{
                    borderRadius: '20px',
                    background: PALETTE.BUTTON_BG_TEAL,
                    color: PALETTE.BRAND_GREY,
                    p: '4px 15px',
                    minHeight: '40px',
                    maxWidth: '200px',
                    minWidth: '100px',
                }}
                onClick={onSkip}
            >
                {t('Skip')}
            </Button>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={!!snackbarMsg}
                autoHideDuration={5000}
                onClose={() => setSnackBarMsg('')}
                message={snackbarMsg}
            />
        </Box>
    );
};
