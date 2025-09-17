import { UserDto } from '../../user/schemas/user.schema';

export type RequestWith<T> = Request & T;
export type RequestWithUserDto = RequestWith<{ user: UserDto }>;
