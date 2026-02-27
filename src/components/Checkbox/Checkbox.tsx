import { FC, memo } from 'react';
import styles from '@/styles/checkbox.module.scss';
import CheckIcon from '@mui/icons-material/Check';

interface CheckboxProps {
    id: string;
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
}

export const Checkbox: FC<CheckboxProps> = memo(({ id, checked, onChange }) => {
    const handleChange = () => {
        onChange(id, !checked);
    };

    return (
        <label className={styles.checkbox}>
            <input
                className={styles.input}
                type="checkbox"
                checked={checked}
                onChange={handleChange}
            />
            <div className={styles.circle}>{checked && <CheckIcon sx={{ fontSize: 12 }} />}</div>
        </label>
    );
});
