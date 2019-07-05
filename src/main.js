import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Bootstrap
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// prismjs
import "prismjs";
import "prismjs/themes/prism-twilight.css";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
