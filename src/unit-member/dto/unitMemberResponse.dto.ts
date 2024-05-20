import { getSchemaPath } from "@nestjs/swagger";
import { UnitMember } from "../schema/unit-member.schema";

export const resGetAllUnitMemberDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'array',
      items: {
        type: 'object',
        item: {
          $ref: getSchemaPath(UnitMember)
        }
      }
    }
  }
}