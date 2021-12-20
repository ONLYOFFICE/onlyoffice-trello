import {ValidatorUtils} from '../validation';

describe('Validator Utils', () => {
    let validator: ValidatorUtils;

    beforeEach(async () => {
        validator = new ValidatorUtils();
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
