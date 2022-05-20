import React from "react";
import { PersonHelper, PersonInterface, DisplayBox, ApiHelper } from ".";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { InputBox, SearchCondition } from "../../components";
import { EditCondition } from "./EditCondition";

interface Props {
  updateSearchResults: (people: PersonInterface[]) => void
}

export function PeopleSearch(props: Props) {
  const [searchText, setSearchText] = React.useState("");
  const [advanced, setAdvanced] = React.useState(false);
  const [conditions, setConditions] = React.useState<SearchCondition[]>([])
  const [showAddCondition, setShowAddCondition] = React.useState(true);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }

  const toggleAdvanced = (e: React.MouseEvent) => { e.preventDefault(); setAdvanced(!advanced); }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = searchText.trim();
    const condition: SearchCondition = { field: "displayName", operator: "contains", value: term }
    ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi").then(data => {
      props.updateSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });
  }

  const handleAdvancedSearch = () => {
    ApiHelper.post("/people/advancedSearch", conditions, "MembershipApi").then(data => {
      props.updateSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });

  }

  const getSimpleSearch = () => (<DisplayBox headerIcon="fas fa-user" headerText="Simple Search" editContent={<a href="about:blank" onClick={toggleAdvanced}>Advanced</a>}>
    <InputGroup>
      <FormControl id="searchText" aria-label="searchBox" name="searchText" type="text" placeholder="Name" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} />
      <InputGroup.Append><Button id="searchButton" variant="primary" onClick={handleSubmit}>Search</Button></InputGroup.Append>
    </InputGroup>
  </DisplayBox>)

  const getAddCondition = () => {
    if (showAddCondition) return <EditCondition conditionAdded={(condition) => { const c = [...conditions]; c.push(condition); setConditions(c); setShowAddCondition(false) }} />
    else return <a href="about:blank" className="float-right text-success" onClick={(e) => { e.preventDefault(); setShowAddCondition(true); }}><i className="fas fa-plus"></i> Add Condition</a>
  }

  const removeCondition = (index: number) => {
    const c = [...conditions];
    c.splice(index, 1);
    setConditions(c);
  }

  const getDisplayConditions = () => {
    const result: JSX.Element[] = [];
    let idx = 0;
    for (let c of conditions) {
      const displayField = c.field.split(/(?=[A-Z])/).map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(" ");
      const displayOperator = c.operator.replace("equals", "=").replace("lessThan", "<").replace("lessThanEqual", "<=").replace("greaterThan", ">").replace("greaterThanEqual", ">=");
      const index = idx;
      result.push(<div>
        <a href="about:blank" onClick={(e) => { e.preventDefault(); removeCondition(index) }}><i className="fas fa-trash text-danger" style={{ marginRight: 10 }}></i></a>
        <b>{displayField}</b> {displayOperator} <i>{c.value}</i>
      </div>);
      idx++;
    }
    return result;
  }

  const getAdvancedSearch = () => (<InputBox id="advancedSearch" headerIcon="fas fa-user" headerText="Advanced Search" headerActionContent={<a href="about:blank" onClick={toggleAdvanced}>Simple</a>} saveFunction={handleAdvancedSearch} saveText="Search">
    <p>All people where:</p>
    {getDisplayConditions()}
    {getAddCondition()}
  </InputBox>)

  if (!advanced) return getSimpleSearch();
  else return getAdvancedSearch();

}