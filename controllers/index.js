const User = require('../models/user');
const Category = require('../models/category');
const Budget = require('../models/budget');
const Bill = require('../models/bill');
const Balance = require('../models/balance');
const LineItem = require('../models/lineItem');
const utilities = require('../helpers/utilities');

module.exports = {
    index,
    dashboard
}

function index(req, res) {    
    if(req.user) return res.redirect('/dashboard');
    res.render('index', {
        user: req.user
    });
}

function dashboard(req, res) {
    Budget.find({ user: req.user._id }, function(err, budgets) {
        Bill.find({ user: req.user.id, budget: budgets[0] }, function(err, bills) {
            Balance.find({ user: req.user._id }, function(err, balances) {

                const newBalances = balances.map(balance => {
                    balance.dateFormatted = utilities.formatDate(balance.date);
                    return balance;
                });

                res.render('dashboard', {
                    user: req.user,
                    budgets,
                    bills,
                    balances: newBalances
                });
            });
        });
    });
}