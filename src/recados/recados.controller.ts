import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { RecadosUtils } from './recados.utils';
import { ONLY_LOWERCASE_LETTERS_REGEX, REMOVE_SPACES_REGEX, SERVER_NAME } from './recados.constants';
import type { RegexProtocol } from '../common/regex/regex.protocol';

// @UseInterceptors(AuthTokenInterceptor)
// @useGards(IsAdminGuard)
@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    private readonly recadosUtils: RecadosUtils,
    @Inject(SERVER_NAME)
    private readonly serverName: string,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RegexProtocol,
    @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
    private readonly onlyLowercaseLettersRegex: RegexProtocol
  ) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    console.log(this.removeSpacesRegex.execute('Batata Quente'));
    console.log(this.onlyLowercaseLettersRegex.execute('Batata Quente'));
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
