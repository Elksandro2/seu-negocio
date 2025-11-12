import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
    secondary: {
      main: '#15C0CC'
    },
    error: {
        main: red.A400,
    },
  },
});

export default theme;