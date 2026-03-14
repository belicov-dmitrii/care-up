import TimePickerSelection from './TimePickerSelection';
import '../styles/react-ios-time-picker.css';

function TimePicker({
    value: initialValue = '',
    cellHeight = 28,
    pickerDefaultValue = '10:00',
    onChange = () => {},
    onSave = (value) => {},
    onCancel = () => {},
    disabled = false,
    cancelButtonText = 'Cancel',
    saveButtonText = 'Save',
    controllers = true,
    seperator = true,
    use12Hours = false,
    onAmPmChange = () => {},
    name = null,
    popupClassName = null,
    inputClassName = null,
}) {
    let finalValue = initialValue;

    if (initialValue === null && use12Hours) {
        finalValue = `${pickerDefaultValue} AM`;
    } else if (initialValue === null && !use12Hours) {
        finalValue = pickerDefaultValue;
    }

    const params = {
        onChange,
        height: cellHeight,
        onSave,
        onCancel,
        cancelButtonText,
        saveButtonText,
        controllers,
        seperator,
        use12Hours,
        onAmPmChange,
        initialValue: finalValue,
        pickerDefaultValue,
    };

    return (
        <>
            {!disabled && (
                <div className="react-ios-time-picker-popup">
                    <div
                        className={`react-ios-time-picker-popup-overlay ${popupClassName || ''}`}
                    />
                    <TimePickerSelection {...params} />
                </div>
            )}
        </>
    );
}

export default TimePicker;
