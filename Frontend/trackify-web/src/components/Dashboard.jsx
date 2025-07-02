// import React from 'react';

// const DashboardPage = () => (
//   <div className="dashboard-page p-4">
//     <div className="d-flex justify-content-between align-items-center mb-4">
//       <h2 className="fw-bold text-gray-800">Dashboard Overview</h2>
//       <button className="btn btn-primary d-flex align-items-center">
//         <i className="bi bi-file-earmark-bar-graph me-2"></i>
//         Generate Report
//       </button>
//     </div>
    
//     <div className="row mb-4">
//       {/* Summary Cards */}
//       <div className="col-lg-3 col-md-6 mb-4">
//         <div className="card shadow-sm border-0 h-100">
//           <div className="card-body">
//             <div className="d-flex align-items-center">
//               <div className="bg-primary-subtle p-3 rounded-circle me-3">
//                 <i className="bi bi-people fs-4 text-primary"></i>
//               </div>
//               <div>
//                 <h5 className="mb-0 text-gray-600">Employees</h5>
//                 <p className="mb-0 fs-2 fw-bold text-primary">142</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="col-lg-3 col-md-6 mb-4">
//         <div className="card shadow-sm border-0 h-100">
//           <div className="card-body">
//             <div className="d-flex align-items-center">
//               <div className="bg-warning-subtle p-3 rounded-circle me-3">
//                 <i className="bi bi-laptop fs-4 text-warning"></i>
//               </div>
//               <div>
//                 <h5 className="mb-0 text-gray-600">Assets</h5>
//                 <p className="mb-0 fs-2 fw-bold text-warning">89</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="col-lg-3 col-md-6 mb-4">
//         <div className="card shadow-sm border-0 h-100">
//           <div className="card-body">
//             <div className="d-flex align-items-center">
//               <div className="bg-success-subtle p-3 rounded-circle me-3">
//                 <i className="bi bi-receipt fs-4 text-success"></i>
//               </div>
//               <div>
//                 <h5 className="mb-0 text-gray-600">Expenses</h5>
//                 <p className="mb-0 fs-2 fw-bold text-success">$12,450</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="col-lg-3 col-md-6 mb-4">
//         <div className="card shadow-sm border-0 h-100">
//           <div className="card-body">
//             <div className="d-flex align-items-center">
//               <div className="bg-info-subtle p-3 rounded-circle me-3">
//                 <i className="bi bi-list-check fs-4 text-info"></i>
//               </div>
//               <div>
//                 <h5 className="mb-0 text-gray-600">Pending Tasks</h5>
//                 <p className="mb-0 fs-2 fw-bold text-info">7</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
    
//     <div className="row">
//       {/* Chart */}
//       <div className="col-lg-8 mb-4">
//         <div className="card shadow-sm border-0 h-100">
//           <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
//             <h5 className="fw-bold mb-0 text-gray-700">Monthly Expenses</h5>
//             <div className="btn-group">
//               <button className="btn btn-sm btn-outline-secondary">Month</button>
//               <button className="btn btn-sm btn-outline-secondary">Quarter</button>
//               <button className="btn btn-sm btn-outline-secondary">Year</button>
//             </div>
//           </div>
//           <div className="card-body">
//             <div className="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center" style={{height: '300px'}}>
//               <p className="text-muted">Expense chart visualization</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Recent Activities */}
//       <div className="col-lg-4 mb-4">
//         <div className="card shadow-sm border-0 h-100">
//           <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
//             <h5 className="fw-bold mb-0 text-gray-700">Recent Activities</h5>
//             <button className="btn btn-sm btn-link text-decoration-none">View All</button>
//           </div>
//           <div className="card-body p-0">
//             <div className="list-group list-group-flush">
//               <div className="list-group-item border-0 py-3 px-3">
//                 <div className="d-flex">
//                   <div className="bg-primary-subtle p-2 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
//                     <i className="bi bi-people text-primary"></i>
//                   </div>
//                   <div>
//                     <h6 className="mb-0">New employee onboarded</h6>
//                     <p className="mb-0 text-muted small">John Doe joined the team</p>
//                     <small className="text-muted">10 minutes ago</small>
//                   </div>
//                 </div>
//               </div>
//               {/* Other activities... */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default DashboardPage;






import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    employees: 0,
    assets: 0,
    expenses: 0,
    pendingTasks: 0,
    recentActivities: [],
  });
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
        try {
        const statsRes = await api.get('/Dashboard/summary');
        const expensesRes = await api.get('/Dashboard/monthly-expenses');

        setStats(statsRes.data);
        setMonthlyExpenses(expensesRes.data);
        } catch (err) {
        console.error('Failed to load dashboard data:', err);
        }
    };

  fetchStats();
  }, []);

  return (
    <div className="dashboard-page p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-gray-800">Dashboard Overview</h2>
        <button className="btn btn-primary d-flex align-items-center">
          <i className="bi bi-file-earmark-bar-graph me-2"></i>
          Generate Report
        </button>
      </div>

      <div className="row mb-4">
        <SummaryCard icon="bi-people" title="Employees" count={stats.employees} color="primary" />
        <SummaryCard icon="bi-laptop" title="Assets" count={stats.assets} color="warning" />
        <SummaryCard icon="bi-receipt" title="Expenses" count={`$${stats.expenses}`} color="success" />
        <SummaryCard icon="bi-list-check" title="Pending Tasks" count={stats.pendingTasks} color="info" />
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
              <h5 className="fw-bold mb-0 text-gray-700">Monthly Expenses</h5>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-secondary">Month</button>
                <button className="btn btn-sm btn-outline-secondary">Quarter</button>
                <button className="btn btn-sm btn-outline-secondary">Year</button>
              </div>
            </div>
            {/* <div className="card-body">
              <div className="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                <p className="text-muted">Expense chart visualization</p>
              </div>
            </div> */}
            <div className="card-body">
                {monthlyExpenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyExpenses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                    <p className="text-muted">Loading chart...</p>
                    </div>
                )}
            </div>

          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
              <h5 className="fw-bold mb-0 text-gray-700">Recent Activities</h5>
              <button className="btn btn-sm btn-link text-decoration-none">View All</button>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {stats.recentActivities.map((activity, index) => (
                  <div key={index} className="list-group-item border-0 py-3 px-3">
                    <div className="d-flex">
                      <div className="bg-primary-subtle p-2 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className={`bi ${activity.icon} text-primary`}></i>
                      </div>
                      <div>
                        <h6 className="mb-0">{activity.title}</h6>
                        <p className="mb-0 text-muted small">{activity.description}</p>
                        <small className="text-muted">{activity.timeAgo}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, count, color }) => (
  <div className="col-lg-3 col-md-6 mb-4">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className={`bg-${color}-subtle p-3 rounded-circle me-3`}>
            <i className={`bi ${icon} fs-4 text-${color}`}></i>
          </div>
          <div>
            <h5 className="mb-0 text-gray-600">{title}</h5>
            <p className="mb-0 fs-2 fw-bold text-${color}">{count}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPage;
