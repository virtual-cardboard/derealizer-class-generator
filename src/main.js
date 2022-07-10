import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

// FontAwesome documentation: https://fontawesome.com/docs/web/use-with/vue/add-icons
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faHome, faGears, faBars } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faHome, faGears, faBars)

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
