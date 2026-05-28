import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./Expenseform";
import FilterBar from "./FilterBar";
import ExpenseList from "./ExpenseList";

function Dashboard() {
    const [filter, setFilter] = useState("all");
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/expenses", { withCredentials: true })
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

    return (
        <div className="dash-container">
            <ExpenseForm setItems={setItems} />
            <FilterBar setFilter={setFilter} />
            <ExpenseList items={items} filter={filter} onDelete={handleDelete} />
        </div>
    )
}

export default Dashboard;