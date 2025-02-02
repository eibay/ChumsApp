import React from "react";
import { ApiHelper, DisplayBox, FormInterface, QuestionInterface, FormQuestionEdit, Permissions, Loading, UserHelper } from ".";
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material"

interface Props { id: string }

export const Form: React.FC<Props> = (props) => {
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const [questions, setQuestions] = React.useState<QuestionInterface[]>(null);
  const [editQuestionId, setEditQuestionId] = React.useState("notset");
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);
  const questionUpdated = () => { loadQuestions(); setEditQuestionId("notset"); }
  const loadData = () => { ApiHelper.get("/forms/" + props.id, "MembershipApi").then(data => setForm(data)); loadQuestions(); }
  const loadQuestions = () => ApiHelper.get("/questions?formId=" + props.id, "MembershipApi").then(data => setQuestions(data));
  const getEditContent = () => (<button className="no-default-style" aria-label="addQuestion" onClick={() => { setEditQuestionId(""); }}><Icon>add</Icon></button>)
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let row = anchor.parentNode.parentNode as HTMLElement;
    let idx = parseInt(row.getAttribute("data-index"));
    setEditQuestionId(questions[idx].id);
  }
  const moveUp = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let row = anchor.parentNode.parentNode as HTMLElement;
    let idx = parseInt(row.getAttribute("data-index"));
    let tmpQuestions = [...questions];
    let question = tmpQuestions.splice(idx, 1)[0];
    tmpQuestions.splice(idx - 1, 0, question);
    setQuestions(tmpQuestions);
    ApiHelper.get("/questions/sort/" + question.id + "/up", "MembershipApi");
  }
  const moveDown = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let row = anchor.parentNode.parentNode as HTMLElement;
    let idx = parseInt(row.getAttribute("data-index"));
    let tmpQuestions = [...questions];
    let question = tmpQuestions.splice(idx, 1)[0];
    tmpQuestions.splice(idx + 1, 0, question);
    setQuestions(tmpQuestions);
    ApiHelper.get("/questions/sort/" + question.id + "/down", "MembershipApi");
  }
  const getRows = () => {
    const rows: JSX.Element[] = [];
    if (questions.length === 0) {
      rows.push(<TableRow key="0"><TableCell>No custom questions have been created yet. Questions will be listed here.</TableCell></TableRow>);
      return rows;
    }
    for (let i = 0; i < questions.length; i++) {
      let upArrow = (i === 0) ? <span style={{ display: "inline-block", width: 20 }} /> : <button className="no-default-style" aria-label="moveUp" onClick={moveUp}><Icon>arrow_upward</Icon></button>
      let downArrow = (i === questions.length - 1) ? <></> : <> &nbsp; <button className="no-default-style" aria-label="moveDown" onClick={moveDown}><Icon>arrow_downward</Icon></button></>
      rows.push(
        <TableRow key={i} data-index={i}>
          <TableCell><a href="about:blank" onClick={handleClick}>{questions[i].title}</a></TableCell>
          <TableCell>{questions[i].fieldType}</TableCell>
          <TableCell style={{ textAlign: "left" }}>{upArrow}{downArrow}</TableCell>
          <TableCell>{questions[i].required ? "Yes" : "No"}</TableCell>
        </TableRow>
      );
    }
    return rows;
  }
  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (questions.length === 0) {
      return rows;
    }
    rows.push(<TableRow sx={{textAlign: "left"}} key="header"><th>Question</th><th>Type</th><th>Action</th><th>Required</th></TableRow>);
    return rows;
  }
  const getSidebarModules = () => {
    let result = [];
    if (editQuestionId !== "notset") result.push(<FormQuestionEdit key="form-questions" questionId={editQuestionId} updatedFunction={questionUpdated} formId={form.id} />)
    return result;
  }

  React.useEffect(loadData, []); //eslint-disable-line

  if (!formPermission) return (<></>);
  else {
    let contents = <Loading />
    if (questions) {
      contents = (<Table>
        <TableHead>{getTableHeader()}</TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>);
    }
    return (
      <>
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <DisplayBox id="questionsBox" headerText="Questions" headerIcon="help" editContent={getEditContent()}>
              {contents}
            </DisplayBox>
          </Grid>
          <Grid item md={4} xs={12}>{getSidebarModules()}</Grid>
        </Grid>
      </>
    );
  }
}
