import React from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <Box>
        <Menu>
          <MenuButton
            borderRadius={"30"}
            as={IconButton}
            aria-label="Options"
            icon={<LanguageRoundedIcon />}
            variant="ghost"
          />
          <MenuList borderRadius={"20"}>
            <MenuItem
              borderRadius={"10"}
              onClick={() => i18n.changeLanguage("fa")}
            >
              فارسی
            </MenuItem>
            <MenuItem
              borderRadius={"10"}
              onClick={() => i18n.changeLanguage("en")}
            >
              English
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </div>
  );
};

export default LanguageSelector;
