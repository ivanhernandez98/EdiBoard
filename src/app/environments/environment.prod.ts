export const environment = {
  API_URL_EDIBOARD: 'https://datahub.apphgtransportaciones.com/',
  API_URL_LOGIN: 'https://user.apphgtransportaciones.com/api/Auth/login',
  API_URL_FPASS: 'https://user.apphgtransportaciones.com/api/Auth/forgotpassword',
  API_URL_POSVIAJES: 'https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetData',
  API_URL_PosViaEdi: 'https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetPosicionesEdi',
  API_VISOR_PosViajes: 'https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetPosiciones',// REMPLAZAR CUANDO SE TENGA LA Productiva
  API_V_EDI_EmpCli: 'https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetEmpresaCliente',
  googleMapApiKey: 'AIzaSyDkVrlyP9TAZAKAesUCEVnnjrrae_OI_So',//AIzaSyClbgspyYklNJiCxFu5vpFO8gFMURJyxbk -- AIzaSyDkVrlyP9TAZAKAesUCEVnnjrrae_OI_So

  autoNavigate: true,
  duration: {
    board: 30000, // 30 segundos para el componente Board
    metricos: 30000, // 30 segundos para el componente Metricos
    viajes: 60000, // 1 minuto para el componente Viajes
    reporte: 60000 // 1 minuto para el componente Reporte
  },

  production: true
};
