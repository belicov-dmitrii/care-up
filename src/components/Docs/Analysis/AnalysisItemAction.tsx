'use client';

import { type FC } from 'react';
import { type AnalysisItem } from '@/types';
import { type ANALYSIS_ITEM_RECOMMENDATIONS_STYLES } from '../utils/const';
import { Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { NetworkRequest } from '@/utils/NetworkRequest';
import moment from 'moment';

type stylesType = typeof ANALYSIS_ITEM_RECOMMENDATIONS_STYLES;

interface IProps {
    styles: stylesType[keyof stylesType];
    analysisItem: AnalysisItem;
}

export const AnalysisItemAction: FC<IProps> = ({ styles, analysisItem }) => {
    const router = useRouter();
    const pathName = usePathname();

    const onActionClick = async () => {
        try {
            switch (styles.action) {
                case 'linkToPharmacy':
                    router.push('/pharmacy');
                    break;
                case 'notificationRepeatTest':
                    await NetworkRequest('notifications/create', {
                        text: `Repeat the ${analysisItem.title} test`,
                        url: pathName,
                        date: moment().add(2, 'weeks').utc().toISOString(),
                    });
                case 'notificationDoctor':
                    await NetworkRequest('notifications/create', {
                        text: `Repeat the ${analysisItem.title} test`,
                        url: pathName,
                        date: moment().add(2, 'days').utc().toISOString(),
                    });
            }
        } catch (_) {}
    };

    return (
        <Button
            type="button"
            sx={{
                borderRadius: '20px',
                background: styles.container,
                color: styles.text,
                p: '4px 10px',
                minHeight: '40px',
                maxWidth: '200px',
            }}
            onClick={onActionClick}
        >
            {styles.title}
        </Button>
    );
};
