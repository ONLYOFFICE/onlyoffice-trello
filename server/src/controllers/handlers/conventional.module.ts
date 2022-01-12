import {forwardRef, Module} from '@nestjs/common';
import {ConventionalSaveCallbackHandler} from '@controllers/handlers/conventional/save.status';
import {ServerModule} from '@modules/server.module';

import {ConventionalNoChangesCallbackHandler} from './conventional/nochanges.status';

@Module({
    imports: [forwardRef(() => ServerModule)],
    providers: [
        ConventionalSaveCallbackHandler,
        ConventionalNoChangesCallbackHandler,
    ],
})
export class ConventionalHandlersModule {}
