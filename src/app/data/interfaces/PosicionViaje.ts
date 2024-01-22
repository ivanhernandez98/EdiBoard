// posicion-viaje.model.ts
/* export interface PosicionViaje {
  dataList: {
    id_unidad: string;
    id_viaje: number;
    posdate: Date;
    posLat: number;
    posLon: number;
    sistema_origen: string;
    ubicacion?: string | null;
  }[];
  dataSingle: {
    shipment: string;
    remitente: string;
    destinatario: string;
    fecha_real_viaje: Date;
    fecha_real_fin_viaje: Date;
  };
} */


export interface PosicionesViajes {
  dataSingle: DataSingle[];
}
export interface DataSingle {
  id_viaje: number;
  remitente: string;
  destinatario: string;
  shipment: string;
  fecha_real_viaje: Date;
  fecha_real_fin_viaje: Date;
  status_viaje:string;
  status_pedido:string;
  posiciones: DataList[];
}
export interface DataList {
  id_unidad: string;
  id_viaje: number;
  posdate: Date;
  posLat: number;
  posLon: number;
  sistema_origen?: string | null;
  ubicacion?: string | null;
}


