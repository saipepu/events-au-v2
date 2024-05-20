import { getSchemaPath } from "@nestjs/swagger";
import { EventUnit } from "../schema/event-unit.schema";

export const resGetAllEventUnitDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'array',
      items: {
        $ref: getSchemaPath(EventUnit)
      }
    }
  }
}
