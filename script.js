'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerUser = document.querySelector('.user');
const containerUserList = document.querySelector('.user-list');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////////////////

const createUserName = function(accs){

  accs.forEach((acc) => {
    acc.userName = acc.owner.toLowerCase().split(' ').map( uName => uName[0]).join('');
  });
};

createUserName(accounts);

/////////////////////////////////////////////////

const displayAccounts = function ( accounts) {

  containerUserList.innerHTML = ' ';

  accounts.forEach( (acc,i) => {

    const html = ` 
    <li class="user__row">
      <p class="user__row__text" ><span class="key" > account </span> <span class="value" >${acc.owner}</span> </p>
      <p class="user__row__text" ><span class="key" > username </span> <span class="user__name value" >${acc.userName} </span></p>
      <p class="user__row__text" ><span class="key" > password </span> <span class="value" >${acc.pin}</span> </p>
   </li> `;

   containerUserList.insertAdjacentHTML('beforebegin',html);
  });
};

displayAccounts(accounts);


//////////////////////////////////////////////////

const displayMovements = function(movements , sort = false ){

  containerMovements.innerHTML = ' ';

  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements ;

  movs.forEach(function(mov,i){

    const type = mov > 0 ? 'deposit' : 'withdrawal';

      const html = ` 
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        
      <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin',html);

  }); 
};

/////////////////////////////////////////////////////////////////////////


const calcDisplayBalance = function( acc ) {

  acc.balance = acc.movements.reduce((acc,cur) => {
    return acc + cur ;
  },0);

  labelBalance.textContent = ` ${acc.balance}€ (EUR) `; 
}


//////////////////////////////////////////////////////////////

const calcDisplaySummary = function(acc) {

  const income = acc.movements.filter(mov => mov > 0).reduce((acc,mov) => acc + mov , 0);
  labelSumIn.textContent = `${income}€`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc,mov) => acc + mov , 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest =  acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate/100).filter(int => int >=1 ).reduce((acc,int) => acc + int , 0);
  labelSumInterest.textContent = `${interest}€`;
}

////////////////////////////////////////////////////////

let currentAccount ;

const updateUI = function (currentAcc) {

  //display movements 
  displayMovements(currentAcc.movements);

  // display balance 
  calcDisplayBalance( currentAcc);

  // display summary 
  calcDisplaySummary(currentAcc);

}

////////////////////////////////////////////////////////////

btnLogin.addEventListener('click',function(e){

  e.preventDefault();

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if ( currentAccount?.pin === Number(inputLoginPin.value) ){
    labelWelcome.textContent = ` Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100 ;
    containerApp.classList.remove("display_none");
    containerUser.classList.add("display_none");
  }

  // clear input field 

  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();

  updateUI (currentAccount);


});

////////////////////////////////////////////////////////////////////

btnTransfer.addEventListener('click' , function(e) {

  e.preventDefault();

  const amount =  Number( inputTransferAmount.value );

  const receiverAcc = accounts.find( acc => acc.userName === inputTransferTo.value ) ;

  if ( amount > 0 &&  receiverAcc && currentAccount.balance >= amount && receiverAcc?.userName !== currentAccount.userName ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }

  updateUI (currentAccount);

  inputTransferAmount.value = inputTransferTo.value = '';

});

//////////////////////////////////////////////////////////////////////////

btnClose.addEventListener('click',function(e){

  e.preventDefault();

  if ( inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin ){

    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName );

    accounts.splice(index,1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

////////////////////////////////////////////////////////////////////////////////

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if ( amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1 )){
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

///////////////////////////////////////////////////////////////////////////////////////

const accountsMovements = accounts.map(acc => acc.movements).flat();
const overallBalance = accountsMovements.reduce((acc,mov) => acc + mov ,0);
console.log(overallBalance);

/////////////////////////////////////////////////////////////////////////////////////

let sorted = false ;
btnSort.addEventListener('click',function(e){
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

///////////////////////////////////////////////////////////

// const euroToUsd = 1.1 ;

// const movementsUsd = movements.map(mov =>  mov * euroToUsd );

// const movementDescription = movements.map((mov,i,arr) => `Movement ${i+1}: You ${mov > 0 ? 'deposited' : 'withdrawal'}  ${Math.abs(mov)} `);  

// console.log(movementDescription);

////////////////////////////////////////////////////////////

// const deposits = movements.filter(mov => mov>0);
// const withdrawals = movements.filter(mov => mov<0); 


// console.log(deposits);
// console.log(movements);
// console.log(withdrawals);

//////////////////////////////////////////////////////////////

// const balance = movements.reduce((acc,cur) => {
//   return acc + cur ;
// },0);

// console.log(balance);

////////////////////////////////////////////////////////////

// const max = movements.reduce((acc,mov) => {
//   if (acc > mov ) return acc ;
//   else return mov ;
// }, movements[0]);

// console.log(max);

////////////////////////////////////////////////////////////////

// const totalDepositUsd = movements.filter(mov => mov>0).map( mov => mov*1.1).reduce((acc,mov) => acc + mov , 0);
// console.log(totalDepositUsd);
