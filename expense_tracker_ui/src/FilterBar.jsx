import React from "react";

function FilterBar(props) {
    return(<div className="filter-bar">
        <button onClick={()=> props.setFilter("all")}>All</button>
        <button onClick={()=> props.setFilter("income")}>Income</button>
        <button onClick={()=> props.setFilter("expense")}>Expense</button>
        <button onClick={()=> props.setFilter("category")}>Category</button>
    </div>)
}

export default FilterBar;