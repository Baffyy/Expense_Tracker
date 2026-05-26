import axios from "axios";

function ExpenseItem(props) {
    async function handleDelete() {
        await axios.delete(`http://localhost:3000/expenses/${props.id}`, { withCredentials: true });
        props.onDelete(props.id);
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <p>{props.amount}</p>
            <p>{props.category}</p>
            <p>{props.type}</p>
            <button onClick={handleDelete}>❌</button>
        </div>
    )
}

export default ExpenseItem;