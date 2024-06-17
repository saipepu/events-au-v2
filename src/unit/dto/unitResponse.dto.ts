import { getSchemaPath } from '@nestjs/swagger';
import { Unit } from '../schema/unit.schema';
import { UnitAdmin } from 'src/unit-admin/schema/unit-admin.schema';

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

export const resGetUnitsByAdminIdDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'array',
      items: {
        $ref: getSchemaPath(UnitAdmin)
      }
    }
  }
}