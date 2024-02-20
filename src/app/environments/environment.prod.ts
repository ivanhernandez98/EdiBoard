export const environment = {
  API_URL_EDIBOARD: 'https://datahub.apphgtransportaciones.com/',
  API_URL_LOGIN: 'https://user.apphgtransportaciones.com/api/Auth/login',
  API_URL_FPASS: 'https://user.apphgtransportaciones.com/api/Auth/forgotpassword',
  API_URL_POSVIAJES: 'https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetData',
  API_URL_PosViaEdi: 'https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetPosicionesEdi',
  API_VISOR_PosViajes: 'https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetPosiciones',// REMPLAZAR CUANDO SE TENGA LA Productiva
  API_V_EDI_EmpCli: 'https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetEmpresaCliente',
  googleMapApiKey: 'AIzaSyClbgspyYklNJiCxFu5vpFO8gFMURJyxbk',

  autoNavigate: true,
  duration: {
    board: 5000, // 5 segundos para el componente Board
    metricos: 5000, // 5 segundos para el componente Metricos
    viajes: 10000, // 10 segundos para el componente Viajes
    reporte: 10000
  },

  production: true
};
