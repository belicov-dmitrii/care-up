import { type CreateScheduleBody } from '@/types';
import { type ActionDispatch } from 'react';

export type CreateScheduleFormBody = Omit<CreateScheduleBody, 'dose'> & {
    dose: Record<string, string>;
};

export enum CreateScheduleActionTypes {
    UpdateMedId = 'UPDATE_MED_ID',
    UpdateFrequency = 'UPDATE_FREQUENCY',
    UpdateEndDate = 'UPDATE_END_DATE',
    UpdateTime = 'UPDATE_TIME',
    UpdateDose = 'UPDATE_DOSE',
    DeleteTime = 'DELETE_TIME',
    AddTime = 'ADD_TIME',
}

type CreateScheduleAction =
    | { type: CreateScheduleActionTypes.UpdateMedId; payload: string }
    | {
          type: CreateScheduleActionTypes.UpdateFrequency;
          payload: CreateScheduleFormBody['type'];
      }
    | { type: CreateScheduleActionTypes.UpdateEndDate; payload: string }
    | {
          type: CreateScheduleActionTypes.AddTime;
          payload: string;
      }
    | {
          type: CreateScheduleActionTypes.UpdateTime;
          payload: CreateScheduleFormBody['time'];
      }
    | {
          type: CreateScheduleActionTypes.DeleteTime;
          payload: string;
      }
    | {
          type: CreateScheduleActionTypes.UpdateDose;
          payload: CreateScheduleFormBody['dose'];
      };

export type CreateScheduleDispatch = ActionDispatch<[action: CreateScheduleAction]>;

export function createScheduleReducer(
    state: CreateScheduleFormBody,
    { type, payload }: CreateScheduleAction
): CreateScheduleFormBody {
    switch (type) {
        case CreateScheduleActionTypes.UpdateMedId:
            return { ...state, medId: payload };

        case CreateScheduleActionTypes.UpdateFrequency:
            return { ...state, type: payload };

        case CreateScheduleActionTypes.UpdateEndDate:
            return { ...state, endDate: payload };

        case CreateScheduleActionTypes.AddTime:
            const [hours, minutes] = payload.split(':');
            const id = crypto.randomUUID();

            return {
                ...state,
                time: [
                    ...state.time,
                    {
                        id,
                        hours: Number(hours),
                        minutes: Number(minutes),
                    },
                ],
                dose: {
                    ...state.dose,
                    [id]: '',
                },
            };

        case CreateScheduleActionTypes.UpdateTime:
            return state;

        case CreateScheduleActionTypes.DeleteTime:
            const stateCopy = { ...state, dose: { ...state.dose } };
            delete stateCopy.dose[payload];
            return {
                ...stateCopy,
                time: stateCopy.time.filter((t) => t.id !== payload),
            };

        case CreateScheduleActionTypes.UpdateDose:
            return {
                ...state,
                dose: {
                    ...state.dose,
                    ...payload,
                },
            };

        default:
            return state;
    }
}
