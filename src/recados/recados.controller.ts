import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/tokenPayload.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ResponseRecadoDto } from './dto/response-recado.dto';

// @UseInterceptors(AuthTokenInterceptor)
// @useGards(IsAdminGuard)
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  @ApiOperation({ summary: 'Obter todos os recados com paginação' }) // desc do endpoint
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 1,
    description: 'Items a pular'
  }) // Parâmetros da querys
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Limite de items por página'
  })
  @ApiResponse({ status: 200, description: 'Recados retornados com sucesso.', type: [ResponseRecadoDto] }) // Resposta examplo
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.recadosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createBodyDto: CreateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.create(createBodyDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBodyDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    return this.recadosService.update(id, updateBodyDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
