<template>
    <div class="invoice-wrap d-flex flex-column" @click="checkClick" ref="invoiceWrap">
        <form @submit.prevent="submitForm" class="invoice-content">
            <h1>New Invoice</h1>


            <!-- Bill From -->
            <div class="bill-from d-flex flex-column">
                <h4>Bill From</h4>
                <div class="input d-flex flex-column">
                    <label for="billerStreetAddress">Street Address</label>
                    <input  type="text" id="billerStreetAddress" v-model="billerStreetAddress"/>
                </div>
                <div class="location-details d-flex">
                    <div class="input d-flex flex-column">
                        <label for="clientCity">City</label>
                        <input  type="text" id="clientCity" v-model="clientCity"/>
                    </div>
                    <div class="input d-flex flex-column">
                        <label for="clientZipCode">Zip Code</label>
                        <input  type="text" id="clientZipCode" v-model="clientZipCode"/>
                    </div>
                    <div class="input d-flex flex-column">
                        <label for="clientCountry">Country</label>
                        <input  type="text" id="clientCountry" v-model="clientCountry"/>
                    </div>
                </div>
            </div>

            <!-- Bill To -->
            <div class="bill-to d-flex flex-column">
                <h4>Bill To</h4>
                <div class="input d-flex flex-column">
                    <label for="clientName">Client's Name </label>
                    <input  type="text" id="clientName" v-model="clientName"/>
                </div>
                <div class="input d-flex flex-column">
                    <label for="clientEmail">Client's Email</label>
                    <input  type="text" id="clientEmail" v-model="clientEmail"/>
                </div>
                <div class="input d-flex flex-column">
                    <label for="clientStreetAddress">Street Address</label>
                    <input  type="text" id="clientStreetAddress" v-model="clientStreetAddress"/>
                </div>
            </div>

            <!-- Invoice Work Details -->
            <div class="invoice-work d-flex flex-column">
                <div class="payment d-flex">
                    <div class="input d-flex flex-column">
                        <label for="invoiceDate">Invoice Date</label>
                        <input disabled type="text" id="invoiceDate" v-model="invoiceDate"/>
                    </div>
                    <div class="input d-flex flex-column">
                        <label for="paymentDueDate">Payment Due</label>
                        <input  type="text" id="paymentDueDate" v-model="paymentDueDate"/>
                    </div>
                </div>
                <div class="input flex flex-column">
                    <div class="input d-flex flex-column">
                        <label for="paymentTerms">Payment Terms</label>
                        <select  type="text" id="paymentTerms" v-model="paymentTerms">
                            <option value="30">Net 30 Days</option>
                            <option value="60">Net 60 Days</option>
                        </select>
                    </div>
                    <div class="input d-flex flex-column">
                        <label for="productDescription">Product Description</label>
                        <input  type="text" id="productDescription" v-model="productDescription"/>
                    </div>
                </div>
                <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Toal</th>
            </tr>
            <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
              <td class="item-name"><input type="text" v-model="item.itemName" /></td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total flex">${{ (item.total = item.qty * item.price) }}</td>
              <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="" />
            </tr>
          </table>

          <div @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
                </div>
            </div>

            <!-- Save/Exit -->
            <div class="save d-flex">
                <div class="left">
                    <button @click="closeInvoice" class="red">Cancel</button>
                </div>
                <div class="right d-flex">
                    <button @click="publishInvoice" class="purple">Create Invoice</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import db from '../firebase/firebaseInit';
import { mapMutations } from 'vuex';
import { uid } from 'uid'
export default {
    name: 'invoiceModal',
    data() {
        return {
            dateOptions: { year: "numeric", month: "short", day: "numeric" },
            docId: null,
            loading: null,
            billerStreetAddress: null,
            billerCity: null,
            billerZipCode: null,
            billerCountry: null,
            clientName: null,
            clientEmail: null,
            clientStreetAddress: null,
            clientCity: null,
            clientZipCode: null,
            clientCountry: null,
            invoiceDateUnix: null,
            invoiceDate: null,
            paymentTerms: null,
            paymentDueDateUnix: null,
            paymentDueDate: null,
            productDescription: null,
            invoicePending: null,
            invoiceDraft: null,
            invoiceItemList: [],
            invoiceTotal: 0,
        }
    },
    methods: {
        ...mapMutations(['TOGGLE_INVOICE']),
        closeInvoice() {
            this.TOGGLE_INVOICE()
        },

        addNewInvoiceItem() {
            this.invoiceItemList.push({
                id: uid(),
                itemName: "",
                qty: "",
                price: 0,
                total: 0,
            });
        },

        deleteInvoiceItem(id) {
            this.invoiceItemList = this.invoiceItemList.filter(item => {
                return item.id != id
            })
        },

        calInvoiceTotal() {
            this.invoiceTotal = 0;
            this.invoiceItemList.forEach(item => {
                this.invoiceTotal += item.total;
            })
        },

        publishInvoice() {
            this.invoicePending = true;
        },

        saveDraft() {
            this.invoiceDraft = true;
        },

        async uploadInvoice() {
            if (this.invoiceItemList.length <= 0) {
                alert('Please ensure you filled out work item!')
                return;
            }

            this.calInvoiceTotal();

            const dataBase = db.collection('invoices').doc()

            await dataBase.set({
                invoiceId: uid(6),
                billerStreetAddress: this.billerStreetAddress,
                billerCity: this.billerCity,
                billerZipCode: this.billerZipCode,
                billerCountry: this.billerCountry,
                clientName: this.clientName,
                clientEmail: this.clientEmail,
                clientStreetAddress: this.clientStreetAddress,
                clientCity: this.clientCity,
                clientZipCode: this.clientZipCode,
                clientCountry: this.clientCountry,
                invoiceDate: this.invoiceDate,
                invoiceDateUnix: this.invoiceDateUnix,
                paymentTerms: this.paymentTerms,
                paymentDueDate: this.paymentDueDate,
                paymentDueDateUnix: this.paymentDueDateUnix,
                productDescription: this.productDescription,
                invoiceItemList: this.invoiceItemList,
                invoiceTotal: this.invoiceTotal,
                invoicePending: this.invoicePending,
                invoiceDraft: this.invoiceDraft,
                invoicePaid: null,
            })

            this.TOGGLE_INVOICE();
        },

        submitForm() {
            this.uploadInvoice()
        }

    },
    created() {
        this.invoiceDateUnix = Date.now();
        this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString("en-us", this.dateOptions)
    },
    watch: {
        paymentTerms() {
            const futureDate = new Date();
            this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms))
            this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString("en-us", this.dateOptions)
        }
    }
}
</script>

<style lang="scss">
    .invoice-wrap {
        position: fixed;
        top: 0;
        left: 0;
        background-color: transparent;
        width: 100%;
        height: 100vh;
        overflow: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        @media(min-width: 900px) {
            left: 90px;
        }

        .invoice-content {
            box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            position: relative;
            padding: 56px;
            max-width: 700px;
            width: 100%;
            background-color: #141625;
            color: #fff;

            h1 {
                margin-bottom: 48px;
                color: #fff;
            }

            h3 {
                margin-bottom: 16px;
                font-size: 18px;
                color: #777f98;
            }

            h4 {
                color: #7c5dfa;
                font-size: 12px;
                margin-bottom: 24px;
            }

            // Bill To / Bill From
            .bill-to,
            .bill-from {
                margin-bottom: 48px;

                .location-details {
                    gap: 16px;
                    div {
                        flex: 1;
                    }
                }
            }

            // Invoice work
            .invoice-work {
                .payment {
                    gap: 24px;
                    div {
                        flex: 1;
                    };
                }
                
                .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
                }
            }

            .save {
                    margin-top: 60px;

                    div {
                        flex: 1;
                    }

                    .right {
                        justify-content: flex-end;
                    }
                }
        }

        .input {
            margin-bottom: 24px;
        }

        label {
            font-size: 12px;
            margin-bottom: 6px;
        }

        input, select {
            width: 100%;
            background-color: #1e2139;
            color: #fff;
            border-radius: 4px;
            padding: 12px 4px;
            border: none;

            &:focus {
                outline: none;
            }
        }
    }
</style>