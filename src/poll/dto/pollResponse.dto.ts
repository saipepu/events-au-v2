import { getSchemaPath } from "@nestjs/swagger";
import { Poll } from "../schema/poll.schema";

export const resGetAllPollDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'array',
      items: {
        $ref: getSchemaPath(Poll)
      }
    }
  }
}