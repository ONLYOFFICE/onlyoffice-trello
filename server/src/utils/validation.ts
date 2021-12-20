import {Injectable} from '@nestjs/common';

/**
 * Useful validators
 */
@Injectable()
export class ValidatorUtils {
    /**
   * Validates onlyoffice document servers' urls (https://documentserverhost/)
   *
   * @param url preferably a document server's url
   * @returns validity flag
   */
    validURL(url: string): boolean {
        const pattern = new RegExp(
            '^(https:\\/\\/)' + // only with https
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}\\/$)',
            'i',
        ); // fragment locator
        return Boolean(pattern.test(url));
    }
}
