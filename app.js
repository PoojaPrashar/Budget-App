//BudgetController Module
var budgetController = (function(){
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calPercentage = function(totalIncome) {
        
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value/totalIncome) * 100);
        }
        
        else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
        
    }
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        
        var sum = 0;
        data.allItems[type].forEach(function(curr){
        sum = sum + curr.value;
      });
        
        data.totals[type] = sum;
        
        
    };
    
    
                  
    var data = {
        
        allItems : {
            exp: [] ,
            inc: []
        },
        
        totals : {
            exp: 0,
            inc: 0
    },
        budget : 0,
        percentage : -1
 };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            // 1. Create the new ID for every different item
              if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            } 
            // 2. Decide what type it is be it 'inc' or 'exp' and make the new item accordingly
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // 3.Push the data into type of the array
             data.allItems[type].push(newItem);
            
            // 4. Return the new Item
             return newItem;
        },
        
        
         deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculateBudget : function() {
        
        // 1. Calcualte total income nad expenses
            calculateTotal('inc');
            calculateTotal('exp');
        
        
        // 2. Calculate budget : inc - exp 
            data.budget = data.totals.inc - data.totals.exp;
        
        
        
        // 3. Calculate the percentage of income that we spent
            
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 );
            }
            
            else {
                data.percentage = -1;
            }
           
    },
        
        getBudget : function() {
         
            return {
            budget : data.budget,
            totalInc : data.totals.inc,
            totalExp : data.totals.exp,
            percentage : data.percentage
            }
        
        
         },
        
        calculatePercentages : function() {
            
            data.allItems.exp.forEach(function(cur){
            cur.calPercentage(data.totals.inc);      
                
            });
            
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur){
               return cur.getPercentage(); 
            });
            return allPerc;
        },
        
        
        
        testing : function() {
            
            console.log(data);
        }
        
        
    };
    
    
})(); //Immediately Invoked Function (IIFE)

//UI Controller
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel:'.budget__value', 
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
                    
    };                
      var formatNumber= function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };              
                    
    return {
        getInput: function() {
            return {
               type : document.querySelector(DOMstrings.inputType).value,
               description : document.querySelector(DOMstrings.inputDescription).value,
               value : parseFloat(document.querySelector(DOMstrings.inputValue).value)    
            };
        },
        
        addListItem : function(obj, type) {
            
            var html, newHtml, element;
            // 1.Create HTML String with placeholder text
            if(type === 'inc') {
                
               element = DOMstrings.incomeContainer;    
               html = '<div class="item clearfix" id="inc-$id$"> <div class="item__description">$description$</div><div class="right clearfix"><div class="item__value">$value$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            }
            
            else if(type === 'exp') {
                
             element = DOMstrings.expensesContainer;    
             html = '<div class="item clearfix" id="exp-$id$"><div class="item__description">$description$</div><div class="right clearfix"><div class="item__value">$value$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
            }
            // 2.Replace placeholder text with the actual data
            
            newHtml = html.replace('$id$', obj.id);
            newHtml = newHtml.replace('$description$', obj.description);
            newHtml = newHtml.replace('$value$', formatNumber(obj.value, type));
            
            // 3.Insert HTML string into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            },
        
        
       deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        clearFields : function() {
            
          var fields, fieldsArr;
            
          fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
          fieldsArr = Array.prototype.slice.call(fields);
            
          fieldsArr.forEach(function(current, index, Array) {
            current.value = "";  
         });
            
          fieldsArr[0].focus();    
            
    },
        
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            var nodeListForEach = function(list, callback) {
              
              for(var i=0;i<list.length;i++) {
                  callback(list[i],i);
              }
                
            };
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        } ,
        
        displayMonth: function() {
          
            var now,year,month,months;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            //var christmas = new Date()
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        }
     };                
})(); //Immediately Invoked Function

//App Controller
var controller = (function(budgetCtrl, UICtrl) {
    
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('Keypress', function(event) {
        if (event.KeyCode === 13 || event.which === 13) {
          ctrlAddItem();
         }
     });
        
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);    
};
    
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
            }
    };
    
    
    
    
    
    var updateBudget = function() {
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
       // 2. Display the budget
       var budget = budgetCtrl.getBudget();
        
       // 3. Display the budegt on the UI
       UICtrl.displayBudget(budget);
 };
    
    var updatePercentages = function() {
        
        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();

        // 2. Read the percentages from budget Controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with new percentages
        UICtrl.displayPercentages(percentages);
 };
    
    
    
    
    
    var ctrlAddItem = function() {
        
        var input, newItem;
    // 1. Get The field input data
       input = UICtrl.getInput();
       
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
           // 2. Add the item to the budget Controller
       newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
    // 3. Add the item to the UI
        UICtrl.addListItem(newItem,input.type);
        
        
    // 4. Clear the fields
        UICtrl.clearFields();
        
        
    // 5. Calculate and update the budget
       updateBudget(); 
            
    // 6. Calculate and update percentages
       updatePercentages();    
            
      }
        
};
    
    return {
        init: function() {
            
            
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
            budget : 0,
            totalInc : 0,
            totalExp : 0,
            percentage : -1
            });
            setupEventListeners();
            
        }
     };
})(budgetController, UIController);

controller.init();
