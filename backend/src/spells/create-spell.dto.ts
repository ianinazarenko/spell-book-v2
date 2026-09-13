import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateSpellDto {
    @IsString()
    @IsNotEmpty({ message: 'Spell could not be empty' })
    spell: string;

    @IsInt()
    @Min(1, { message: 'At least 1 minute ritual' })
    @Max(360, { message: 'At most 3 hours ritual' })
    duration: number;
}
