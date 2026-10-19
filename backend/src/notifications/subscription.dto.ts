import { IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

class PushKeysDto {
    @IsString()
    @IsNotEmpty()
    p256dh: string;

    @IsString()
    @IsNotEmpty()
    auth: string;
}

export class SubscriptionDto {
    @IsString()
    @IsNotEmpty()
    endpoint: string;

    @IsObject()
    @IsNotEmpty()
    keys: PushKeysDto;

    @IsDate()
    @IsOptional()
    expirationTime: string;
}
