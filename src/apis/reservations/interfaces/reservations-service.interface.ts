import { CreateReservationInput } from '../dto/create-reservation.input';

export interface IReservationsServiceCreate {
	createReservationInput: CreateReservationInput;
}

export interface IReservationsServiceCheckDuplication {
	date: Date;
	time: string;
	shopId: string;
}

export interface IReservationsServiceFindById {
	reservationId: string;
}

export interface IReservationsServiceFindAllByUserId {
	userId: string;
}

export interface IReservationsServiceFindDeletedById {
	reservationId: string;
}

export interface IReservationsServiceFindAllByUserId {
	userId: string;
}

export interface IReservationsServiceDelete {
	reservationId: string;
}

export interface IReservationsServiceFindAllByUserId {
	userId: string;
}

export interface IReservationsServiceFindAllByShopId {
	shopId: string;
}
