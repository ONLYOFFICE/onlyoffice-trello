import { forwardRef, Module } from '@nestjs/common';
import { ServerModule } from '@modules/server.module';

import { ConventionalSaveCallbackHandler } from '@controllers/handlers/conventional/save.status';
import { ConventionalNoChangesCallbackHandler } from '@controllers/handlers/conventional/nochanges.status';

@Module({
  imports: [forwardRef(() => ServerModule)],
  providers: [
    ConventionalSaveCallbackHandler,
    ConventionalNoChangesCallbackHandler,
  ],
})
export class ConventionalHandlersModule {}
