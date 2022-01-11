import { Constants } from '@utils/const';
import { FileUtils } from '@utils/file';
import { OAuthUtil } from '@utils/oauth';
import {ValidatorUtils} from '../validation';

describe('Validator Utils', () => {
    let validator: ValidatorUtils;

    beforeEach(async () => {
        validator = new ValidatorUtils(new FileUtils(new Constants()), new OAuthUtil());
    });

    it('https valid url', () => {
        const valid = validator.validURL('https://httpbin.com/');
        expect(valid).toBe(true);
    });

    it('https invalid url', () => {
        const valid = validator.validURL('https://httpbin.com');
        expect(valid).toBe(false);
    });

    it('any http is invalid', () => {
        const valid = validator.validURL('http://httpbin.com');
        expect(valid).toBe(false);
    });
});
