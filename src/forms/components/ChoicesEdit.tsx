import React from "react";
import { QuestionInterface } from ".";
import { Table, TableBody, TableRow, TableCell, TableHead, FormLabel, TextField, Button } from "@mui/material"

interface Props { question: QuestionInterface, updatedFunction: (question: QuestionInterface) => void }

export const ChoicesEdit: React.FC<Props> = (props) => {
  const [choiceValue, setChoiceValue] = React.useState("");
  const [choiceText, setChoiceText] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    switch (e.target.name) {
      case "choiceValue": setChoiceValue(e.target.value); break;
      case "choiceText": setChoiceText(e.target.value); break;
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let idx = parseInt(anchor.getAttribute("data-index"));
    let q = { ...props.question };
    q.choices.splice(idx, 1);
    props.updatedFunction(q);
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    let q = { ...props.question };
    if (!q.choices) q.choices = [{ value: choiceValue, text: choiceText }];
    else q.choices.push({ value: choiceValue, text: choiceText });
    props.updatedFunction(q);
    setChoiceText("");
    setChoiceValue("");
  }

  const getRows = () => {
    let result = [];
    if (props.question.choices) {
      for (let i = 0; i < props.question.choices?.length; i++) {
        let c = props.question.choices[i];
        result.push(<TableRow key={i}>
          <TableCell>{c.value}</TableCell>
          <TableCell>{c.text}</TableCell>
          <TableCell><Button variant="contained" size="small" onClick={handleRemove} data-index={i}>Remove</Button></TableCell>
        </TableRow>);
      }
    }
    return result;
  }

  return (
    <>
      <FormLabel>Choices</FormLabel>
      <Table size="small">
        <TableHead><TableRow sx={{textAlign: "left"}}><th>Value</th><th>Text</th><th>Action</th></TableRow></TableHead>
        <TableBody>
          {getRows()}
          <TableRow>
            <TableCell><TextField label="Value" fullWidth size="small" name="choiceValue" data-cy="value" value={choiceValue} onChange={handleChange} /></TableCell>
            <TableCell><TextField label="Text" fullWidth size="small" name="choiceText" data-cy="text" value={choiceText} onChange={handleChange} /></TableCell>
            <TableCell><Button id="addQuestionChoiceButton" data-cy="add-button" variant="contained" size="small" onClick={handleAdd}>Add</Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
