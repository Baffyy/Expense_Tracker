import React, {useState} from "react";
import axios from "axios";

function ExpenseForm(props) {
    const [isAccepted, setIsAccepted] = useState(true);

    const [form,setForm] = useState({
        title: "",
        amount: "",
        category: "",
        type: "expense"
    })

    function handleText(event) {
        const {name, value}= event.target;
        
        setForm(prevValue => {
            return {
                ...prevValue, [name]: value
            }
        })
    }

    async function handleClick(event) {
        event.preventDefault();

        if (form.title === "" || form.amount === "" || form.category === "") {
            setIsAccepted(false)
    } else {
            const data= await axios.post("http://localhost:3000/expenses", form, { withCredentials: true });
            props.setItems(prevItems => {
                return [...prevItems, {...form, id: data.data.id}]
            })
            setForm({ title: "", amount: "", category: "", type:"expense" })
    }
    }

    return(<form>
        <div>
            <label htmlFor="title">Title</label>
            <input type="text" onChange={handleText} name="title" id="title" value={form.title}/>
        </div>
        <div>
        <label htmlFor="amount">Amount(£)</label>
        <input type="text"  onChange={handleText} name="amount" id="amount" value={form.amount} />
        </div>
        <div>
            <label htmlFor="cat">Category</label>
            <select name="category" onChange={handleText} value={form.category} id="cat">
                <option value=""></option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="housing">Housing</option>
                <option value="entertainment">Entertainment</option>
                <option value="salary">Salary</option>
                <option value="other">Other</option>
            </select>
        </div>
        <div>
            <label htmlFor="type">Type</label>
            <select name="type" onChange={handleText} value={form.type} id="type">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>
        </div>


        <button onClick={handleClick} type="submit">Submit</button>

    </form>)
}

export default ExpenseForm;