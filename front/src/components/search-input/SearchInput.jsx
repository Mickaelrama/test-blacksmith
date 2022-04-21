import { Search, Close } from "@mui/icons-material";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

const SearchInput = ({ onChange }) => {
  const [searchText, setSearchText] = useState("");

  const handleClickRemoveText = () => {
    setSearchText("");
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  // debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onChange(searchText);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder="Rechecher"
      value={searchText}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickRemoveText}>
              <Close />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;
