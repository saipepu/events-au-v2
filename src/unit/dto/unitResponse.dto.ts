import { getSchemaPath } from '@nestjs/swagger';
import { Unit } from '../schema/unit.schema';

export const resGetAllDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'array',
      items: {
        $ref: getSchemaPath(Unit)
      }
    }
  }
}

export const resCreateUnitSuccessDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'string',
      $ref: getSchemaPath(Unit)
    }
  }
}