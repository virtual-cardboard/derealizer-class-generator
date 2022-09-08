import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'highlight.js/styles/atom-one-dark.css';
import hljs from 'highlight.js/lib/core';
import java from 'highlight.js/lib/languages/java';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import PrimeVue from 'primevue/config';

import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button'

import 'primevue/resources/themes/saga-green/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import './index.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

// FontAwesome documentation: https://fontawesome.com/docs/web/use-with/vue/add-icons
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faBars, faGears, faHome } from '@fortawesome/free-solid-svg-icons'

hljs.registerLanguage('java', java);

/* add icons to the library */
library.add(faHome, faGears, faBars)

createApp(App)
    .use(router)
    .use(PrimeVue)
    .use(hljsVuePlugin)
    .component('dropdown', Dropdown).component('input-text', InputText).component('checkbox', Checkbox).component('Button', Button)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
