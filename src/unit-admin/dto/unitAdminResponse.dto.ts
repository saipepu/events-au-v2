import { getSchemaPath } from "@nestjs/swagger";
import { UnitAdmin } from "../schema/unit-admin.schema";

export const resGetAllUnitAdminDto = {
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
