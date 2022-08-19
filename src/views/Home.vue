<template>
    <div class="home container">
        <div class="header d-flex">
            <div class="fleft d-flex flex-column">
                <h1>Invoices</h1>
                <span>There are 4 total invoices</span>
            </div>
            <div class="right d-flex flex-column">
                <div class="filter d-flex" @click="toggleFilterMenu">
                    <span>Filter by status</span>
                    <img src="@/assets/icon-arrow-down.svg" alt="">
                    <ul v-show="filterMenu" class="filter-menu">
                        <li>Draft</li>
                        <li>Pending</li>
                        <li>Paid</li>
                        <li>Clear Filter</li>
                    </ul>
                </div>
                <div class="button d-flex" @click="newInvoice">
                    <div class="inner-button d-flex">
                        <img src="@/assets/icon-plus.svg" alt="">
                    </div>
                    <span>New Incoice</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    name: 'HomeComponent',
    data() {
        return {
            filterMenu: null,
        }
    },
    components: {},
    methods: {
        ...mapMutations(['TOGGLE_INVOICE']),
        toggleFilterMenu() {
            this.filterMenu = !this.filterMenu;
        },
        newInvoice() {
            this.TOGGLE_INVOICE();
        }
    }
}
</script>

<style lang="scss">
.home {
    color: #fff;
}

.header {
    margin-bottom: 65px;
    .left,
    .right {
       flex: 1; 
    }

    .right {
        justify-content: flex-end;
        align-items: center;

        .button,
        .filter {
            align-items: center;

            span {
                font-size: 12px;
            }
        }
    }

    .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;
        user-select: none;


        span,
        img {
            pointer-events: none;
        }

        img {
            margin-left: 12px;
            width: 9px;
            height: 5px;
        }

        .filter-menu {
            width: 120px;
            position: absolute;
            top: 25px;
            list-style: none;
            background-color: #1e2139;
        }

        li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
                color: #1e2139;
                background: #fff;

            }
        }
    }

    .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;
        user-select: none;
        cursor: pointer;

        .inner-button {
            margin-right: 8px;
            border-radius: 50%;
            padding: 8px;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            img {
                width: 10px;
                height: 10px;
            }
        }
    }
}
</style>