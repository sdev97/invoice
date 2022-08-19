<template>
  <div>
    <div v-if="!mobile" class="app d-flex">
      <Navigation />
      <div class="app-content flex flex-column">
        <transition name="invoice">
          <InvoiceModal v-if="invoiceModal" />
        </transition>
        <router-view />
      </div>
    </div>
    <div v-else class="mobile-message flex flex-column">
      <h2>Sorry! This Website not support mobile devices !</h2>
      <p>To use this website, please use a computer or at least a tablet!</p>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import InvoiceModal from '@/components/InvoiceModal.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      mobile: null,
    }
  },
  components: {
    Navigation,
    InvoiceModal
  },
  mounted() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen)
  },
  methods: {
    checkScreen() {
      const windowWidth = window.innerWidth
      if (windowWidth <= 500) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
    }
  },
  computed: {
    ...mapState(['invoiceModal'])
  }
 }
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  background-color: #141625;
  min-height: 100vh;
  flex-direction: column;
  @media(min-width: 900px) {
    flex-direction: row !important;
  }
}

.app-content {
  padding: 0 20px;
  flex: 1;
  position: relative;
}

.mobile-message {
  text-align: center;
  margin-top: 50%;
  color: red;

  p {
    color: black;
    margin-top: 16px;
  }
}

// Animated invoice 

.invoice-enter-active,
.invoice-leave-active {
  transition: 0.8s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
}
</style>
