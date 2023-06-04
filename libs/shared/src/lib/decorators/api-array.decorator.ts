import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
// import { ObjectId } from '@nft/core-lib';
import { ApiDecoratorOptions, apiDecoratorDefaults } from '../models';
// const objectId = new ObjectId();

const ApiArray = function ({
  required,
  type,
  example = ['item'],
  readOnly,
}: ApiDecoratorOptions = apiDecoratorDefaults) {
  return applyDecorators(IsArray(), ApiProperty({ type: type, required, isArray: true, example, readOnly }));
};

/* const ObjectIdArray = function ({ required }: ApiDecoratorOptions = apiDecoratorDefaults) {
  return ApiArray({ required, type: objectId, example: [objectId] });
}; */

export { ApiArray };
// export { ApiArray, ObjectIdArray };
