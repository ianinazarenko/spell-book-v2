import { IsNotEmpty, IsObject, IsString } from 'class-validator';

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
}
