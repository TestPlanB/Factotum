import { hapTasks } from '@ohos/hvigor-ohos-plugin';
import {factotumHapPlugin,factotumHspPlugin,factotumHarPlugin} from 'factotum_plugin'
export default {
    system: hapTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
    plugins:[factotumHapPlugin()]         /* Custom plugin to extend the functionality of Hvigor. */
}
