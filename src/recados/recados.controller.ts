import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { RecadosUtils } from './recados.utils';
import { SERVER_NAME } from '../common/constants/server-name.constant';

// DTO - Data Transfer Object
// DTO -> Simple Object -> Validate data / Transform data

// @UseInterceptors(AuthTokenInterceptor)
// @useGards(IsAdminGuard)
@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    private readonly recadosUtils: RecadosUtils,
    @Inject(SERVER_NAME)
    private readonly serverName: string
  ) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    console.log(this.serverName);
    return this.recadosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    console.log(this.recadosUtils.invertString('nauaK'));

    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createBodyDto: CreateRecadoDto) {
    return this.recadosService.create(createBodyDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBodyDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateBodyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recadosService.remove(id);
  }
}
