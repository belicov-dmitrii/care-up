import { type FormFieldType } from '@/components/Forms/FormElement';
import { number } from 'yup';

type StepFieldNames<TStep> =
    TStep extends Array<infer TItem>
        ? TItem extends { name: infer TName }
            ? TName
            : TItem extends Array<infer TNested>
              ? TNested extends { name: infer TNestedName }
                  ? TNestedName
                  : never
              : never
        : never;

export const numberField = () =>
    number()
        .transform((value, originalValue) =>
            originalValue === '' ? undefined : Number(originalValue)
        )
        .typeError('Must be a number');

export const getStepFieldNames = <
    TStep extends ReadonlyArray<FormFieldType<string> | ReadonlyArray<FormFieldType<string>>>,
>(
    step: TStep
): Array<StepFieldNames<TStep>> => {
    return step
        .flatMap((field) => (Array.isArray(field) ? field : [field]))
        .map((field) => field.name) as Array<StepFieldNames<TStep>>;
};
