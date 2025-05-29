let fieldCounter = 1;

function houseExpense(totalPayment, monthlyIncome) {
   const threshold = monthlyIncome * 0.32;

   if (totalPayment <= threshold) {
      return { isAffordable: true, excessAmount: 0 };
   } else {
      const excessAmount = totalPayment - threshold;
      return { isAffordable: false, excessAmount: excessAmount };
   }
}

function addNewfield() {
   // Create container div with the same style as original expense sections
   const container = document.createElement('div');
   container.className = 'expenseSection';

   // Create label container
   const labelContainer = document.createElement('div');

   // Create label input with full width
   const labelInput = document.createElement('input');
   labelInput.type = 'text';
   labelInput.placeholder = 'Enter expense name...';
   labelInput.className = 'expenseLabel';

   // Create expense input container
   const inputContainer = document.createElement('div');

   // Create input for amount
   const expenseInput = document.createElement('input');
   expenseInput.type = 'number';
   expenseInput.className = 'dynamicInput';
   expenseInput.placeholder = 'Enter amount here...';
   expenseInput.id = `dynamicField${fieldCounter}`;

   // Create remove button
   const removeButton = document.createElement('button');
   removeButton.textContent = 'X';
   removeButton.className = 'removeButton';
   removeButton.onclick = function () {
      container.remove();
      calculateMortgageAffordability();
   };

   // Handle label input changes
   labelInput.addEventListener('change', function () {
      if (labelInput.value.trim() !== '') {
         // Create new label element
         const label = document.createElement('label');
         label.textContent = labelInput.value;
         label.className = 'dynamicLabel';

         // Replace input with the new label
         labelContainer.replaceChild(label, labelInput);
         expenseInput.focus();
      }
   });

   // Handle Enter key
   labelInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && labelInput.value.trim() !== '') {
         // labelInput.blur();
      }
   });

   expenseInput.addEventListener('input', calculateMortgageAffordability);

   // Append elements in the correct order
   labelContainer.appendChild(labelInput);
   inputContainer.appendChild(expenseInput);
   inputContainer.appendChild(removeButton);

   container.appendChild(labelContainer);
   container.appendChild(inputContainer);

   // Insert before the "Add Expense" button
   const addButton = document.querySelector('.addButton');
   addButton.parentNode.insertBefore(container, addButton);

   fieldCounter++;
}

function getAllDynamicExpenses() {
   const dynamicInputs = document.querySelectorAll('.dynamicInput');
   return Array.from(dynamicInputs)
      .map(input => parseFloat(input.value) || 0)
      .reduce((sum, value) => sum + value, 0);
}

// Add this function to validate monthly income
function validateMonthlyIncome() {
   const monthlyIncome = document.getElementById('monthlyIncome').value;
   if (!monthlyIncome || monthlyIncome <= 0) {
      alert(
         'Please enter your monthly income before calculating affordability'
      );
      document.getElementById('monthlyIncome').focus();
      return false;
   }
   return true;
}

function calculateMortgageAffordability() {
   // First check if monthly income is entered
   if (!validateMonthlyIncome()) {
      return;
   }

   const mortgagePayment =
      parseFloat(document.getElementById('mortgagePayment').value) || 0;
   const monthlyIncome =
      parseFloat(document.getElementById('monthlyIncome').value) || 0;

   const maintenanceFee =
      parseFloat(document.getElementById('maintenance').value) || 0;

   const utilities =
      parseFloat(document.getElementById('utilities').value) || 0;
   const internet = parseFloat(document.getElementById('internet').value) || 0;
   const miscellaneous =
      parseFloat(document.getElementById('miscellaneous').value) || 0;

   //Add all the dynamic expenses
   const dynamicExpenses = getAllDynamicExpenses();

   const totalPayment =
      mortgagePayment +
      maintenanceFee +
      utilities +
      internet +
      miscellaneous +
      dynamicExpenses;

   const result = houseExpense(totalPayment, monthlyIncome);

   //Get the total Payment Element
   const totalPaymentElement = document.getElementById('totalPayment') || 0;
   totalPaymentElement.textContent = `Total House Expenses:$${totalPayment.toFixed(
      2
   )}`;

   //get result Element
   const resultElement = document.getElementById('result');

   //create new paragraph dynamically
   let resultMessage;

   //based on result text color will change teal or red
   if (result.isAffordable) {
      resultMessage = document.createElement('p');
      resultMessage.className = 'good';
      resultMessage.textContent =
         'The mortgage payment is within 32% of your monthly income';
   } else {
      resultMessage = document.createElement('p');
      resultMessage.className = 'bad';
      resultMessage.textContent = `Your house expense exceeds 32% of your monthly income by ${result.excessAmount.toFixed(
         2
      )} `;
   }

   resultElement.innerHTML = '';
   resultElement.appendChild(resultMessage);
}

function selectProperty(price, maintenance, propertyTax) {
   //First Check if monthly income is entered
   if (!validateMonthlyIncome()) {
      document.querySelector('.calculator-section').scrollIntoView({
         behavior: 'smooth',
         block: 'start',
      });
      return;
   }
   // Calculate approximate mortgage payment
   // function calculateMortgage(price, interestRate = 0.05, years = 25) {
   //    const monthlyRate = interestRate / 12;
   //    const numPayments = years * 12;
   //    return (
   //       (price * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
   //       (Math.pow(1 + monthlyRate, numPayments) - 1)
   //    );
   // }
   //Calculate mortgage payment with dynamic inputs from rates and amortization
   function calculateMortgage(price, interestRate = 0.05, years = 25) {
      const monthlyRate = interestRate / 12;
      const numPayments = years * 12;
      return (
         (price * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
         (Math.pow(1 + monthlyRate, numPayments) - 1)
      );
   }

   // Calculate estimated mortgage payment
   const mortgagePayment = calculateMortgage(price);

   // Populate calculator fields
   document.getElementById('mortgagePayment').value =
      mortgagePayment.toFixed(2);
   document.getElementById('maintenance').value = maintenance;
   document.getElementById('utilities').value = '0'; // Default value
   document.getElementById('internet').value = '0'; // Default value
   document.getElementById('miscellaneous').value = (propertyTax / 12).toFixed(
      2
   );
   // Trigger calculation
   calculateMortgageAffordability();

   document.querySelector('.calculator-section').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
   });
}
// Add event listener for monthly income field
document.addEventListener('DOMContentLoaded', function () {
   // Add required attribute to monthly income input
   const monthlyIncomeInput = document.getElementById('monthlyIncome');
   monthlyIncomeInput.required = true;
});

// Initialize map with Toronto center
const map = L.map('map').setView([43.6532, -79.3832], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Coordinates mapping for the addresses
const locationCoordinates = {
   // Toronto locations
   '123 Queen Street, Toronto': [43.6522, -79.3832],
   '456 Yonge Street, Toronto': [43.661, -79.3832],
   '789 Bathurst Street, Toronto': [43.6647, -79.4088],
   '50 FOREST MANOR ROAD Toronto': [43.7771, -79.3449],
   '3047 FINCH Avenue W': [43.7563, -79.5324],

   // Other locations
   '321 Mississauga Road, Mississauga': [43.589, -79.6441],
   '654 Wellington Street, Ottawa': [45.4215, -75.6972],
   '2900 HIGHWAY 7 ROAD Vaughan': [43.797, -79.532],
};

// Function to format currency
const formatCurrency = amount => {
   return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
   }).format(amount);
};

// Function to get coordinates for an address
function getCoordinates(address) {
   for (const [key, coords] of Object.entries(locationCoordinates)) {
      if (address.includes(key)) {
         return coords;
      }
   }
   return null;
}

// Load and display house data
fetch('house.json')
   .then(response => response.json())
   .then(houses => {
      const propertyList = document.getElementById('propertyList');
      const markers = [];

      houses.forEach(house => {
         const coords = getCoordinates(house.address);

         if (coords) {
            // Create custom popup content
            const popupContent = `
                    <div class="property-info">
                        <strong>${house.address}</strong>
                        <p>Price: ${formatCurrency(house.price)}</p>
                        <p>Maintenance: ${formatCurrency(
                           house.maintenance_fee
                        )}/month</p>
                        <p>Property Tax: ${formatCurrency(
                           house.property_tax
                        )}/year</p>
                        <p>Size: ${house.sq_ft} sq ft</p>
                        <p>Year Built: ${house.year_built}</p>
                        <button class="select-property-btn" onclick="selectProperty(${
                           house.price
                        }, ${house.maintenance_fee}, ${house.property_tax})">
                            Calculate Affordability
                        </button>
                    </div>
                `;

            // Create marker with custom icon
            const marker = L.marker(coords).bindPopup(popupContent).addTo(map);

            markers.push(marker);

            // Create property card
            const propertyCard = document.createElement('div');
            propertyCard.className = 'property-card';
            propertyCard.innerHTML = `
                    <h3>${house.address}</h3>
                    <p>Price: ${formatCurrency(house.price)}</p>
                    <p>Maintenance: ${formatCurrency(
                       house.maintenance_fee
                    )}/month</p>
                    <p>Property Tax: ${formatCurrency(
                       house.property_tax
                    )}/year</p>
                    <p>Size: ${house.sq_ft} sq ft</p>
                    <p>Year Built: ${house.year_built}</p>
                    <button class="select-property-btn" onclick="selectProperty(${
                       house.price
                    }, ${house.maintenance_fee}, ${house.property_tax})">
                        Calculate Affordability
                    </button>
                `;
            propertyList.appendChild(propertyCard);
         }
      });

      // Fit map to show all markers
      if (markers.length > 0) {
         const group = new L.featureGroup(markers);
         map.fitBounds(group.getBounds().pad(0.1));
      }
   })
   .catch(error => {
      console.error('Error loading house data:', error);
      alert('Error loading house data. Please check the console for details.');
   });
