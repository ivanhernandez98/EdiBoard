export interface EdiMetrico {
  list_metricos?: ListMetricos[] | null;
  ediEstatus?: EdiEstatus[] | null;
  semanas?: number[] | null;
}

export interface ListMetricos {
  semana: number;
  cantidad: number;
  id_estatus: number;
  estatus: string;
}

export interface EdiEstatus {
  id_estatus: number;
  estatus: string;
  orden: number;
  color: string;  
}
