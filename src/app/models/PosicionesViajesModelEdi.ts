export namespace PosicionViajesModel {

  export class DataSingleEdiResult {
    constructor(
      public header?: headerEstatusEdi,
      public infoTimeShipments?: TranscurridoEdi[],
      public infoErrorShipments?: ErroresShipmentsEdi[],
      public detailsShipments?: InfoShipmentsEdi[],
      public viajesPosicionesEdi?: DataSingleEdi[]
    ) {}
  }

  export class ShipmentsBoardDetallesEdi {
    constructor(
      public cabecera?: headerEstatusEdi,
      public tiempoShipments?: TranscurridoEdi[],
      public error?: ErroresShipmentsEdi[],
      public ShipmentsEventos?: InfoShipmentsEdi[],
      public HeaderEstatusViajesEdi?: DataSingleEdi[],
      public PosEstatusViajesEdi?: DataListEdi[]
    ) {}
  }

  export class headerEstatusEdi {
    constructor(
      public nuevos: number = 0,
      public confirmados: number = 0,
      public relacionados: number = 0,
      public reporeventos: number = 0,
      public cancelados: number = 0,
      public liberados: number = 0,
      public fallidos: number = 0
    ) {}
  }

  export class TranscurridoEdi {
    constructor(
      public descripcion?: string,
      public shipment?: string,
      public estatus_EDI?: string,
      public horasTranscurrido?: string
    ) {}
  }

  export class ErroresShipmentsEdi {
    constructor(
      public shipment?: string,
      public equipo?: string,
      public errores?: string,
      public detalle_En_La?: string
    ) {}
  }

  export class InfoShipmentsEdi {
    constructor(
      public clienteEdiPedidoId: number = 0,
      public clienteId: number = 0,
      public codeSCAC?: string,
      public estatus_EDI?: string,
      public shipment?: string,
      public equipo?: string,
      public descripcion?: string,
      public fechaIngreso: Date = new Date(),
      public fechaAceptacion: Date = new Date(),
      public fechaRelacionPedido: Date = new Date(),
      public fechaExpiracion: Date = new Date(),
      public fecha_real_viaje: Date = new Date(),
      public fecha_real_fin_viaje: Date = new Date(),
      public tipo_Mov?: string,
      public seg_TRucks?: string,
      public id_pedido?: number,
      public id_viaje?: number,
      public mctnumber?: string,
      public estatus_204?: string,
      public cant?: number,
      public AA?: string,
      public X3?: string,
      public AF?: string,
      public AG?: string,
      public X6?: string,
      public X1?: string,
      public AB?: string,
      public D1?: string,
      public id_estatus?: number,
      public hr_ing_acep?: number,
      public hr_creacion_pedido?: number,
      public hr_StopIni_Viaje?: number,
      public fechaRelacionPedidoMin?: number,
      public usuarioAceptacion?: string,
      public horasTranscurridas?: string
    ) {}
  }

  export class DataSingleEdi {
    constructor(
      public id_viaje: number = 0,
      public remitente: string = '',
      public destinatario: string = '',
      public shipment: string = '',
      public fecha_real_viaje: Date = new Date(),
      public fecha_real_fin_viaje: Date = new Date(),
      public status_viaje: string = '',
      public status_pedido: string = '',
      public posiciones: DataListEdi[] = []
    ) {}
  }

  export class DataListEdi {
    constructor(
      public id_unidad: string = '',
      public id_viaje: number = 0,
      public posdate: Date = new Date(),
      public posLat: number = 0,
      public posLon: number = 0,
      public sistema_origen?: string
    ) {}
  }
}
