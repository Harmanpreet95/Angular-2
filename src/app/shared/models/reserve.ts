import * as moment from 'moment';

export class Product {
    productName = ' ';
    description = ' ';
    uniqueProductId = ' ';
    price = 0;
    quantity = 1;
    tax = 0;
    shippingStandard = 0;
    imageUrl = ' ';
}

export class Payment {
    paymentDate: Date;
    paymentDateFormatted: String;
    paymentNumber = 0;
    paymentAmount = 0;
}

export class Reserve {
    reserveId = 0;
    reserveName = '';
    merchantUid: string;
    applyPayments: Boolean = false;
    interval = 6;
    addressId: number = null;
    scheduleTypeConst = 'WEEKLY';
    accountUid = '';
    lockedIn = false;
    requiresDeposit = false;
    adjustedTotal = 0;
    subTotal = 0;
    bufferPercentage = 0;
    depositPercentage = 0;
    totalDays = 0;
    totalWeeks = 0;
    totalMonths = 0;
    totalPayments = 0;
    depositAmount = 0;
    totalProduct = 0;
    totalShipping = 0;
    totalTax = 0;
    paymentAmount = 0;
    // startDate: Date = new Date();
    startDate: string = moment().format('Y-MM-DD');
    goalDate: Date;
    products: Product[];
    payments: Payment[];

    public Calculate() {

        // reset data
        this.reset();

        // get total product
        this.products.forEach(product => {
            // add up all
            this.totalProduct = +this.totalProduct + +product.price;
            this.totalTax = +this.totalTax + +product.tax;
            this.totalShipping = +this.totalShipping + +product.shippingStandard;
        });

        // start Date
        const startDateMoment = moment(this.startDate);
        const goalDateMoment = moment(this.startDate);

        // check schedule type
        switch (this.scheduleTypeConst) {
            case 'DAILY':
                goalDateMoment.add(this.interval, 'days');
                break;
            case 'WEEKLY':
                goalDateMoment.add(this.interval, 'weeks');
                break;
            case 'MONTHLY':
                goalDateMoment.add(this.interval, 'months');
                break;
        }

        // set subTotal
        this.subTotal = this.totalProduct;

        // set adjusted total
        this.adjustedTotal = +this.subTotal + +this.totalTax + +this.totalShipping;

        // set payment amount
        if (this.depositPercentage > 0) {

            // set payments
            this.totalPayments = +this.interval;

            // set required
            this.requiresDeposit = true;

            // set despsit amount
            this.depositAmount = +this.adjustedTotal * (+this.depositPercentage / 100);

            // set new total
            const newTotal = +this.adjustedTotal - this.depositAmount;

            // set payment amount
            this.paymentAmount = Math.round((newTotal / (+this.totalPayments - 1)) * 100) / 100;

        } else {

            // set payments
            this.totalPayments = +this.interval + 1;

            // set payment amount
            this.paymentAmount = Math.round((+this.adjustedTotal / +this.totalPayments) * 100) / 100;

        }

        // check for nan
        if (!this.adjustedTotal) this.adjustedTotal = 0;
        if (!this.totalTax) this.totalTax = 0;

        // set goal Date
        this.goalDate = new Date(goalDateMoment.format('MM/DD/Y'));

        // create payments
        this.createPayments();
    }

    private createPayments() {

        // set check date
        let checkDate = moment(this.startDate);

        // init payments
        this.payments = new Array();

        // create payments
        for (let ctr = 0; ctr < this.totalPayments; ctr++) {

            // checkDate
            const payment = new Payment();

            // check schedule type
            switch (this.scheduleTypeConst) {
                case 'DAILY':
                    checkDate = moment(this.startDate).add(ctr, 'days');
                    break;
                case 'WEEKLY':
                    checkDate = moment(this.startDate).add(ctr, 'weeks');
                    break;
                case 'MONTHLY':
                    checkDate = moment(this.startDate).add(ctr, 'months');
                    break;
            }

            // set properties
            payment.paymentDate = new Date(checkDate.format('MM/DD/Y'));
            payment.paymentDateFormatted = moment(payment.paymentDate).format('MM/DD/Y');

            // set payment numbers
            payment.paymentNumber = ctr;

            // check for first payment
            if (ctr === 0 && this.depositPercentage > 0) {
                payment.paymentAmount = +this.depositAmount;
            } else {
                payment.paymentAmount = this.paymentAmount;
            }

            // check for nan
            if (!payment.paymentAmount) payment.paymentAmount = 0;

            // push payment
            this.payments.push(payment);
        }

        // calculate over / under
        const diff = +this.adjustedTotal - (+((+this.totalPayments - 1) * +this.paymentAmount) + this.depositAmount);

        // add to last payment
        // this.payments[this.payments.length - 1].paymentAmount = +this.payments[this.payments.length - 1].paymentAmount + +diff;
        this.payments[this.payments.length - 1].paymentAmount = +diff;
    }

    protected getGoalDateFormatted() {
        return moment(this.goalDate).format('MM/DD/Y');
    }

    private reset() {
        this.totalProduct = 0;
        this.totalTax = 0;
        this.totalShipping = 0;
        this.adjustedTotal = 0;
        this.subTotal = 0;
        this.totalDays = 0;
        this.totalWeeks = 0;
        this.totalMonths = 0;
        this.totalPayments = 0;
        this.totalProduct = 0;
        this.paymentAmount = 0;
    }
}
