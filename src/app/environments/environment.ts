export const environment = {
  API_URL_EDIBOARD: 'https://localhost:7295/',
  API_URL_LOGIN: 'https://hgtransportaciones.com/security/api/auth/login',
  API_URL_PosViaEdi: 'https://localhost:7078/api/PosicionViajes',
  API_URL_POSVIAJES: 'https://localhost:7078/api/PosicionViajes/GetData',
  API_VISOR_PosViajes: 'https://localhost:7078/api/PosicionViajes/GetPosiciones',
  API_V_EDI_EmpCli: 'https://localhost:7078/api/PosicionViajes/GetEmpresaCliente',
  googleMapApiKey: 'AIzaSyClbgspyYklNJiCxFu5vpFO8gFMURJyxbk',

  autoNavigate: 0,
  duration: {
    board: 5000, // 5 segundos para el componente Board
    metricos: 5000, // 5 segundos para el componente Metricos
    viajes: 10000, // 10 segundos para el componente Viajes
  },
  production: false
};
