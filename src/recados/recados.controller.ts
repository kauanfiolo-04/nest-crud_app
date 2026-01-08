/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';

// DTO - Data Transfer Object
// DTO -> Simple Object -> Validate data / Transform data

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.recadosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createBodyDto: CreateRecadoDto) {
    return this.recadosService.create(createBodyDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBodyDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateBodyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recadosService.remove(id);
  }
}
