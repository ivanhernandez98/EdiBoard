class InfoEstatusShipments {
  public ClienteEdiPedidoId?: number;
  public ClienteId?: number;
  public CodeSCAC?: string;
  public Estatus_EDI?: string;
  public Shipment?: string;
  public Equipo?: string;
  public descripcion?: string;
  public FechaIngreso?: Date;
  public FechaAceptacion?: Date;
  public fechaRelacionPedido?: Date;
  public FechaExpiracion?: Date;
  public fecha_real_viaje?: Date;
  public fecha_real_fin_viaje?: Date;
  public Tipo_Mov?: string;
  public Seg_TRucks?: string;
  public id_pedido?: number;
  public id_viaje?: number;
  public mctnumber?: string;
  public Estatus_204?: string;
  public Cant?: number;
  public AA?: string;
  public X3?: string;
  public AF?: string;
  public AG?: string;
  public X6?: string;
  public X1?: string;
  public AB?: string;
  public D1?: string;
  public id_estatus?: number;
  public hr_ing_acep?: number;
  public hr_creacion_pedido?: number;
  public hr_StopIni_Viaje?: number;
  public fechaRelacionPedidoMin?: number;
  public UsuarioAceptacion?: string;
  public HorasTranscurridas?: string;
}

class ShipmentsBoardDetalles {
  public datasingle?: Datasingle;
  public empresaCliente: EmpresaCliente = new EmpresaCliente();
}

class EmpresaCliente {
  public Empresa?: string;
  public ClienteEdiConfiguracionId?: number;
  public Cliente?: string;
}

class Datasingle {
  public cabecera?: HeaderEstatus;
  public tiempoShipments?: Transcurrido[];
  public error?: ErroresShipments[];
  public ShipmentsEventos?: InfoEstatusShipments[];
}

class HeaderEstatus {
  public Nuevos?: number;
  public Confirmados?: number;
  public Relacionados?: number;
  public Reporeventos?: number;
  public Cancelados?: number;
  public Liberados?: number;
  public Fallidos?: number;
}

class Transcurrido {
  public descripcion?: string;
  public Shipment?: string;
  public Estatus_EDI?: string;
  public HorasTranscurrido?: string;

  public GetBadgeStyle(): string {
    if (this.HorasTranscurrido) {
      const array = this.HorasTranscurrido.split(':');
      const HorasMinutos = (parseInt(array[0]) * 60) + parseInt(array[1]);

      if (HorasMinutos < 30) { return 'badge bg-primary'; }
      else if (HorasMinutos > 30 && HorasMinutos < 60) { return 'badge bg-success'; }
      else if (HorasMinutos > 60 && HorasMinutos < 90) { return 'badge bg-warning'; }
      else if (HorasMinutos > 90) { return 'badge bg-danger'; }
    }

    return this.Estatus_EDI === 'Confirmar' ? 'badge bg-danger' :
      this.Estatus_EDI === 'Relacionar' ? 'badge bg-warning' :
        this.Estatus_EDI === 'Reportar Eventos' ? 'badge bg-success' : '';
  }
}

class ErroresShipments {
  public Shipment?: string;
  public Equipo?: string;
  public Errores?: string;
  public Detalle_En_La?: string;
}
