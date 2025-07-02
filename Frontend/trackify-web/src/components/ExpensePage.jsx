// import React from 'react';
// import AddExpense from './AddExpense';
// import ExpenseList from './ExpenseList';

// const ExpensePage = () => (
//   <div className="container-fluid px-4 py-4">
//     <div className="row">
//       <div className="col-lg-5 mb-4">
//         <AddExpense />
//       </div>
//       <div className="col-lg-7">
//         <ExpenseList 
//           refreshTrigger={refreshTrigger} 
//           onEdit={handleEdit} 
//         />
//       </div>
//     </div>
//   </div>
// );

// export default ExpensePage;



import React, { useState } from 'react';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';

const ExpensePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleEdit = (expense) => {
    setSelectedExpense(expense); // Populate form for editing
  };

  const handleFormSubmit = () => {
    setRefreshTrigger(prev => prev + 1); // Refresh list
    setSelectedExpense(null); // Clear form
  };

  return (
    <div className="container-fluid">
      <div className="row g-4">
        <div className="col-lg-5">
          <AddExpense 
            selectedExpense={selectedExpense} 
            onFormSubmit={handleFormSubmit} 
          />
        </div>
        <div className="col-lg-7">
          <ExpenseList 
            refreshTrigger={refreshTrigger} 
            onEdit={handleEdit} 
          />
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;