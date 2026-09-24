import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateSpellDto {
    @IsString()
    @IsNotEmpty({ message: 'Spell could not be empty' })
    spell: string;
}
