/* eslint-disable import/no-unresolved */
import * as typed from 'typed-contracts';
import { createEffect } from 'effector';

//#region prebuilt code
export type GenericErrors =
  | {
      status: 'unexpected';
      error: Error;
    }
  | {
      status: 'unknown_status';
      error: { status: number; body: unknown };
    }
  | {
      status: 'validation_error';
      error: typed.ValidationError;
    };

function parseWith<T>(
  name: string,
  contract: typed.Contract<T>,
  value: unknown,
): T {
  const parsed = contract(name, value);
  if (parsed instanceof typed.ValidationError) {
    throw { status: 'validation_error', error: parsed };
  }
  return parsed;
}

function throwWith<T>(
  name: string,
  contract: typed.Contract<T>,
  status: string,
  value: unknown,
): never {
  const error = parseWith(name, contract, value);
  throw { status, error };
}

interface AccessRecoverySendEmail {
  email: string;
}
//#endregion prebuilt code

const accessRecoverySendEmailOk = typed.undef;
export interface AccessRecoverySendEmailDone {
  status: 'ok';
  answer: typed.Get<typeof accessRecoverySendEmailOk>;
}

const accessRecoverySendEmailBadRequest = typed.object({
  error: typed.union('invalid_email', 'invalid_password'),
});
const accessRecoverySendEmailInternalServerError = typed.undef;
export type AccessRecoverySendEmailFail =
  | {
      status: 'bad_request';
      /** Reset code or password is invalid */
      error: typed.Get<typeof accessRecoverySendEmailBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof accessRecoverySendEmailInternalServerError>;
    }
  | GenericErrors;

export const accessRecoverySendEmailFx = createEffect<
  AccessRecoverySendEmail,
  AccessRecoverySendEmailDone,
  AccessRecoverySendEmailFail
>({
  async handler(params) {
    const name = 'accessRecoverySendEmail.body';
    const answer: any = {};
    switch (answer.status) {
      case 200:
        return {
          status: 'ok',
          answer: parseWith(name, accessRecoverySendEmailOk, answer.body),
        };
      case 400:
        throwWith(
          name,
          accessRecoverySendEmailBadRequest,
          'bad_request',
          answer.body,
        );
      case 500:
        throwWith(
          name,
          accessRecoverySendEmailInternalServerError,
          'internal_server_error',
          answer.body,
        );
      default:
        throw {
          status: 'unknown_status',
          error: { status: answer.status as number, body: answer.body },
        };
    }
  },
});
