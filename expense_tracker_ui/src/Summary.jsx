import React from "react";

function Summary(props) {
    return(<div className="summary-cards">
        <div className="summary-card income">
            <div className="card-label">Total Income</div>
            <div className="card-value">£{props.totalIncome.toFixed(2)}</div>
        </div>
        <div className="summary-card expense">
            <div className="card-label">Total Expenses</div>
            <div className="card-value">£{props.totalExpenses.toFixed(2)}</div>
        </div>
        <div className="summary-card balance">
            <div className="card-label">Balance</div>
            <div className="card-value">£{props.balance.toFixed(2)}</div>
        </div>
    </div>)
}

export default Summary;