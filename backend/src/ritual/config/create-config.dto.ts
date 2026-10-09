import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateConfigDto {
    @IsInt()
    @IsNotEmpty({ message: 'Iterations count should be specified' })
    @Min(1, { message: 'At least 1 iteration' })
    @Max(10800, { message: 'At most 8888 iterations' })
    iterationsTotal: number;

    @IsInt()
    @IsOptional()
    @Min(1, { message: 'At least 1 minute ritual' })
    @Max(360, { message: 'At most 3 hours ritual' })
    durationMin?: number;
}
