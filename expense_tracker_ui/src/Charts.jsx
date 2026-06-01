import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function Charts(props) {
    const expenses = props.items.filter(item => item.type === "expense");

    const categoryTotals = {};
    
    expenses.forEach(item => {
        const cat = item.category;
        const amount = parseFloat(item.amount);
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    });

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: [
                "#c9a84c", 
                "#2ecc71",  
                "#e74c4c",  
                "#3498db",  
                "#9b59b6",  
                "#e67e22",  
            ],
            borderWidth: 0,
        }]
    };

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: "#f0f0f0",
                    font: { family: "Syne" }
                }
            }
        }
    };

    if (expenses.length === 0) return null;

    return (
        <div className="chart-section">
            <h2>Spending by category</h2>
            <Doughnut data={data} options={options} />
        </div>
    );
}

export default Charts;