import { Box, Switch, TextField, Typography } from '@mui/material';
import { type ChangeEvent, type FC, memo, useState } from 'react';
import { useI18n } from '../I18nProvider';
import { type NewMedType } from './utils/types';
import { type FormikHandlers } from 'formik';
import moment from 'moment';

interface IExpirationDateChooser {
    value: NewMedType['expirationDate'];
    setValue: ReturnType<FormikHandlers['getFieldHelpers']>['setValue'];
}

export const ExpirationDateChooser: FC<IExpirationDateChooser> = memo(({ value, setValue }) => {
    const [hasDate, setHasDate] = useState(true);

    const { t } = useI18n();

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(moment(e.target.value));
    };

    const changeHasDate = (_: unknown, checked: boolean) => {
        if (!checked) {
            setValue(null);
        }

        setHasDate(checked);
    };

    return (
        <Box width="100%">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}
            >
                <Typography>{t('Has expiration Date?')}</Typography>
                <Switch checked={hasDate} onChange={changeHasDate} />
            </Box>
            <TextField
                type="date"
                value={hasDate ? (value?.format('YYYY-MM-DD') ?? '') : ''}
                onChange={onInputChange}
                disabled={!hasDate}
                slotProps={{
                    htmlInput: {
                        min: moment().format('YYYY-MM-DD'),
                    },
                }}
            />
        </Box>
    );
});
