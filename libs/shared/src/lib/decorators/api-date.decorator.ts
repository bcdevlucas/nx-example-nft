import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { apiDecoratorDefaults, ApiDecoratorOptions } from '../models';

export const ApiPastDate = function ({ required, readOnly }: ApiDecoratorOptions = apiDecoratorDefaults) {
  return applyDecorators(IsDateString(), ApiProperty({ type: Date, required, readOnly, default: new Date() }));
};
