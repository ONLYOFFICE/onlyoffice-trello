import {forwardRef, Module} from '@nestjs/common';
import {ConventionalSaveCallbackHandler} from '@controllers/handlers/conventional/save';
import {ServerModule} from '@modules/server.module';

import {ConventionalNoChangesCallbackHandler} from './conventional/nochanges';

@Module({
    imports: [forwardRef(() => ServerModule)],
    providers: [
        ConventionalSaveCallbackHandler,
        ConventionalNoChangesCallbackHandler,
    ],
})
export class ConventionalHandlersModule {}
