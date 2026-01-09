/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { TimingConnectionInterceptor } from '../common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from '../common/interceptors/error-handling.interceptor';

// DTO - Data Transfer Object
// DTO -> Simple Object -> Validate data / Transform data

@Controller('recados')
// @UsePipes(ParseIntIdPipe) poderia ser usado no controller
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  @UseInterceptors(TimingConnectionInterceptor)
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.recadosService.findAll(paginationDto);
  }

  @Get(':id')
  @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  findOne(@Param('id') id: number) {
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
