import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/tokenPayload.dto';
import { RoutePolicyGuard } from '../auth/guards/route-policy.guard';
import { SetRoutePolicy } from '../auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from '../auth/enum/route-policies.enum';

// @UseInterceptors(AuthTokenInterceptor)
// @useGards(IsAdminGuard)
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.recadosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy(RoutePolicies.createRecado)
  @Post()
  create(@Body() createBodyDto: CreateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.create(createBodyDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBodyDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    return this.recadosService.update(id, updateBodyDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
