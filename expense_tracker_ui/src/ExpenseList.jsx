import ExpenseItem from "./ExpenseItem";

function ExpenseList(props) {
    const filtered = props.items.filter(item => {
        if (props.filter === "all") return true;
        if (props.filter === "income") return item.type === "income";
        if (props.filter === "expense") return item.type === "expense";
    });

    return (
        <div className="expense-grid">
            {filtered.map(item => (
                <ExpenseItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    amount={item.amount}
                    type={item.type}
                    onDelete={props.onDelete}
                />
            ))}
        </div>
    )
}

export default ExpenseList;