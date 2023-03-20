import { CreateReservationInput } from '../dto/create-reservation.input';

export interface IReservationsServiceCreate {
	shopId: string;
	userId: string;
	createReservationInput: CreateReservationInput;
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
