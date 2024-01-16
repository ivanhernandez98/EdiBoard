// Definición de tipo para un elemento del menú
export interface MenuItem {
    Id: number;
    IdPadre: number | null;
    Nombre: string;
    Url: string | null;
    crear: boolean | false;
    editar: boolean | false;
    eliminar:boolean | false;
    imprimir: boolean | false;
    IdCompania : number | 0;
  }
