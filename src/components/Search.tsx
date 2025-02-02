import React from "react";
import { PersonInterface, PersonHelper } from "./";
import { Table, TableBody, TableRow, TableCell, Icon, TextField, Button, Box } from "@mui/material"

interface Props {
  handleSearch: (text: string) => void,
  searchResults: PersonInterface[],
  buttonText: string,
  handleClickAction: (id: string) => void,
}

export const Search: React.FC<Props> = (props) => {
  const [searchText, setSearchText] = React.useState<string>("");
  const [rows, setRows] = React.useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.handleSearch(searchText);
    }
  };

  const createRows = () => {
    const tableRows = props.searchResults?.map((person, index) => (
      <TableRow key={person.id}>
        <TableCell style={{paddingLeft: 0}}>
          <img src={PersonHelper.getPhotoUrl(person)} alt="avatar" />
        </TableCell>
        <TableCell>{person.name.display}</TableCell>
        <TableCell style={{paddingRight: 0}}>
          <button type="button" className="no-default-style" onClick={() => {
            props.handleClickAction(person.id);
          }}>
            <Box sx={{display: "flex", alignItems: "center"}}>
              <Icon sx={{marginRight: "5px"}}>person</Icon>{props.buttonText}
            </Box>
          </button>
        </TableCell>
      </TableRow>
    ));

    setRows(tableRows);
  };

  React.useEffect(createRows, [props.searchResults]); //eslint-disable-line

  return (
    <>
      <TextField fullWidth name="personAddText" label="Person" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown}
        InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" onClick={() => props.handleSearch(searchText)}>Search</Button> }}
      />
      <Table size="small" id="searchResults">
        <TableBody>{rows}</TableBody>
      </Table>
    </>
  );
};
