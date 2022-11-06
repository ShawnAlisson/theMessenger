import { Box, IconButton, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { thisYear } from "../../config/DateHandler";

export default function Footer() {
  const { toggleColorMode } = useColorMode();
  return (
    <footer>
      <Box display={"flex"} flexDir="column" alignItems="center">
        <Box display={"flex"}>
          <LanguageSelector />

          <IconButton
            onClick={toggleColorMode}
            variant="ghost"
            borderRadius={20}
          >
            <DarkModeRoundedIcon />
          </IconButton>
        </Box>

        <Link to="/" style={{ fontSize: "12px", marginTop: "10px" }}>
          Challenjeu © {thisYear()}
        </Link>
      </Box>
    </footer>
  );
}
