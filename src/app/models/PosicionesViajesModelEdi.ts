export namespace PosicionViajesModel {

  export class DataSingleEdiResult {
    constructor(
      public Header?: headerEstatusEdi,
      public InfoTimeShipments?: TranscurridoEdi[],
      public InfoErrorShipments?: ErroresShipmentsEdi[],
      public DetailsShipments?: InfoShipmentsEdi[],
      public ViajesPosicionesEdi?: DataSingleEdi[]
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
      public NUEVOS: number = 0,
      public CONFIRMADOS: number = 0,
      public RELACIONADOS: number = 0,
      public REPOREVENTOS: number = 0,
      public CANCELADOS: number = 0,
      public LIBERADOS: number = 0,
      public FALLIDOS: number = 0
    ) {}
  }

  export class TranscurridoEdi {
    constructor(
      public descripcion?: string,
      public Shipment?: string,
      public Estatus_EDI?: string,
      public HorasTranscurrido?: string
    ) {}
  }

  export class ErroresShipmentsEdi {
    constructor(
      public Shipment?: string,
      public Equipo?: string,
      public Errores?: string,
      public Detalle_En_La?: string
    ) {}
  }

  export class InfoShipmentsEdi {
    constructor(
      public ClienteEdiPedidoId: number = 0,
      public ClienteId: number = 0,
      public CodeSCAC?: string,
      public Estatus_EDI?: string,
      public Shipment?: string,
      public Equipo?: string,
      public descripcion?: string,
      public FechaIngreso: Date = new Date(),
      public FechaAceptacion: Date = new Date(),
      public fechaRelacionPedido: Date = new Date(),
      public FechaExpiracion: Date = new Date(),
      public fecha_real_viaje: Date = new Date(),
      public fecha_real_fin_viaje: Date = new Date(),
      public Tipo_Mov?: string,
      public Seg_TRucks?: string,
      public id_pedido?: number,
      public id_viaje?: number,
      public mctnumber?: string,
      public Estatus_204?: string,
      public Cant?: number,
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
      public UsuarioAceptacion?: string,
      public HorasTranscurridas?: string
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
      public PosLat: number = 0,
      public PosLon: number = 0,
      public Sistema_origen?: string
    ) {}
  }
}
