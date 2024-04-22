export const environment = {
  API_URL_EDIBOARD: 'https://localhost:7295/',
  API_URL_LOGIN: 'https://hgtransportaciones.com/security/api/auth/login',
  API_URL_PosViaEdi: 'https://localhost:7078/api/PosicionViajes',
  API_URL_POSVIAJES: 'https://localhost:7078/api/PosicionViajes/GetData',
  API_VISOR_PosViajes: 'https://localhost:7078/api/PosicionViajes/GetPosiciones',
  API_V_EDI_EmpCli: 'https://localhost:7078/api/PosicionViajes/GetEmpresaCliente',
  googleMapApiKey: 'AIzaSyDkVrlyP9TAZAKAesUCEVnnjrrae_OI_So', //AIzaSyClbgspyYklNJiCxFu5vpFO8gFMURJyxbk -- AIzaSyDkVrlyP9TAZAKAesUCEVnnjrrae_OI_So

  autoNavigate: true,
  duration: {
    board: 30000, // 30 segundos para el componente Board
    metricos: 30000, // 30 segundos para el componente Metricos
    viajes: 60000, // 1 minuto para el componente Viajes
    reporte: 60000 // 1 minuto para el componente Reporte
  },
  production: false
};
