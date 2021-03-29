import React from "react";
import { ApiHelper, InputBox, Helper, DonationBatchInterface, UniqueIdHelper } from ".";

interface Props { batchId: string, updatedFunction: () => void }

export const BatchEdit: React.FC<Props> = (props) => {
    const [batch, setBatch] = React.useState<DonationBatchInterface>({ batchDate: new Date(), name: "" });

    const handleCancel = () => { props.updatedFunction(); }
    const handleSave = () => ApiHelper.post("/donationbatches", [batch], "GivingApi").then(() => props.updatedFunction());
    const getDeleteFunction = () => { return (!UniqueIdHelper.isMissing(props.batchId)) ? handleDelete : undefined; }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }

    const handleDelete = () => {
        if (window.confirm("Are you sure you wish to permanently delete this batch?")) {
            ApiHelper.delete("/donationbatches/" + batch.id, "GivingApi").then(() => props.updatedFunction());
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var b = { ...batch } as DonationBatchInterface;
        switch (e.currentTarget.name) {
            case "name": b.name = e.currentTarget.value; break;
            case "date":
                b.batchDate = new Date(e.currentTarget.value);
                if (isNaN(b.batchDate.getTime())) b.batchDate = null;
                break;
        }
        setBatch(b);
    }

    const loadData = () => {
        if (UniqueIdHelper.isMissing(props.batchId)) setBatch({ batchDate: new Date(), name: "" });
        else ApiHelper.get("/donationbatches/" + props.batchId, "GivingApi").then(data => setBatch(data));
    }

    React.useEffect(loadData, [props.batchId]);

    return (
        <InputBox id="batchBox" headerIcon="fas fa-hand-holding-usd" headerText="Edit Batch" cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} saveFunction={handleSave} >
            <div className="form-group">
                <label>Name (optional)</label>
                <input type="text" data-cy="batch-name" className="form-control" name="name" value={batch.name} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
            <div className="form-group">
                <label>Date</label>
                <input type="date" data-cy="batch-date" className="form-control" name="date" value={Helper.formatHtml5Date(batch.batchDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
        </InputBox >
    );
}

