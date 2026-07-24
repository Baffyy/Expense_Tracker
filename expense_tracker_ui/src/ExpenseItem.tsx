import axios from "axios";
import React from "react";

interface ExpenseItemProps {
    id: number;
    title: string;
    category: string;
    type: "income" | "expense";
    amount: number;
    onDelete: (id: number) => void;
  }
  

function ExpenseItem(props) {
    async function handleDelete() {
        await axios.delete(`/expenses/${props.id}`, { withCredentials: true });
        props.onDelete(props.id);
    }

    return (
        <div className="item">
            <div>
                <h3>{props.title}</h3>
                <p>{props.category}</p>
            </div>
            
            <div className="item-right">
                <span className={`item-amount ${props.type}`}>
                    {props.type === "income" ? "+" : "-"}£{props.amount}
                </span>
                <div className="item-btn">
                    <button onClick={handleDelete}>❌</button>
            </div>
        </div>
    </div>
    )
}

export default ExpenseItem;