import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./Expenseform";
import FilterBar from "./FilterBar";
import ExpenseList from "./ExpenseList";
import Charts from "./Charts";
import Summary from "./Summary";

function Dashboard() {
    const [filter, setFilter] = useState("all");
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/expenses", { withCredentials: true })
            .then(res => {
                if (!res.data.success) {
                    navigate("/");
                } else {
                    setItems(res.data.expenses);
                }
            })
            .catch(() => navigate("/"));
    }, []);

    function handleDelete(id) {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    }

    async function handleLogout() {
        const result= await axios.post("/logout", {}, {withCredentials: true})
        if(result) {
            navigate("/")
        }
    }

    const totalIncome = items
    .filter(i => i.type === "income")
    .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    const totalExpenses = items
    .filter(i => i.type === "expense")
    .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    const balance = totalIncome - totalExpenses;

    return (
     <div> 
        <nav>
            <h1>Expense Tracker</h1>
            <button onClick={handleLogout} className="btn">Logout</button>
        </nav>
        <div className="dash-container">
            <Summary totalIncome={totalIncome} totalExpenses={totalExpenses} balance={balance} />
            <ExpenseForm setItems={setItems} />
            <FilterBar setFilter={setFilter} />
            <ExpenseList items={items} filter={filter} onDelete={handleDelete} />
            <Charts items={items} />
        </div>
    </div>
       
    )
}

export default Dashboard;