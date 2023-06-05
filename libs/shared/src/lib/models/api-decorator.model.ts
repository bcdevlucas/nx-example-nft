import { applyDecorators } from '@nestjs/common';
import { ApiDecoratorOptions } from './index';

export type ApiDecoratorType = (opts?: ApiDecoratorOptions & any) => ReturnType<typeof applyDecorators>;
