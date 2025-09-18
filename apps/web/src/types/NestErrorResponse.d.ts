import type z from 'zod';

interface NestErrorResponse<TForm extends object = z.infer<object>> {
  statusCode: number;
  message: string;
  error: string;
  cause: {
    field: keyof TForm;
  };
}
