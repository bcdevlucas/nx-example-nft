import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ObjectId } from '@nft/utility';
import { apiDecoratorDefaults, ApiDecoratorOptions } from '../models';
const example = new ObjectId().toHexString();

const ApiObjectId = function ({ required, readOnly = false, description }: ApiDecoratorOptions = apiDecoratorDefaults) {
  return applyDecorators(IsMongoId(), ApiProperty({ type: String, required, example, readOnly, description }));
};

export { ApiObjectId };
