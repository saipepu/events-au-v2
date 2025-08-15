import { Controller, Delete, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/common/decorator/public.decorator";
import { PendingUserService } from "./pending-user.service";

@Public()
@ApiTags('Pending User')
@Controller('pending-user')
export class PendingUserController {
  constructor(private readonly pendingUserService: PendingUserService) {}

  @Get()
  findAll() {
    return this.pendingUserService.findAll();
  }

  @Delete()
  deleteAll() {
    return this.pendingUserService.deleteAll();
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.pendingUserService.deleteOne(id);
  }
}