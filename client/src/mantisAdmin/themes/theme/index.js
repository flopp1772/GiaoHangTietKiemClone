// ==============================|| PRESET THEME - DEFAULT ||============================== //

export default function Default(colors) {
  const { blue, red, gold, cyan, grey } = colors;
  const green = {
    50: '#e3f9ec',
    100: '#b9edcb',
    200: '#8ee1ab',
    300: '#5fd58b',
    400: '#39ca71',
    500: '#01b53b',   // ✅ Màu chính bạn muốn
    600: '#01a234',
    700: '#018d2d',
    800: '#017824',
    900: '#005c18',
    A100: '#a2f5b7',
    A200: '#6bf294',
    A400: '#00ef5b',
    A700: '#00cf4f'
  };

  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };

  const contrastText = '#fff';

  return {
    primary: {
      lighter: green[50],
      100: green[100],
      200: green[200],
      light: green[300],
      400: green[400],
      main: green[500],   // màu chính
      dark: green[700],
      700: green[700],
      darker: green[900],
      900: green[900],
      contrastText
    },
    secondary: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500],
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0]
    },
    error: {
      lighter: red[0],
      light: red[2],
      main: red[4],
      dark: red[7],
      darker: red[9],
      contrastText
    },
    warning: {
      lighter: gold[0],
      light: gold[3],
      main: gold[5],
      dark: gold[7],
      darker: gold[9],
      contrastText: greyColors[100]
    },
    info: {
      lighter: cyan[0],
      light: cyan[3],
      main: cyan[5],
      dark: cyan[7],
      darker: cyan[9],
      contrastText
    },
    success: {
      lighter: green[50],    // chỉnh lại theo key
      light: green[300],     // chỉnh lại theo key
      main: green[500],      // chỉnh lại theo key
      dark: green[700],      // chỉnh lại theo key
      darker: green[900],    // chỉnh lại theo key
      contrastText
    },
    grey: greyColors
  };
}