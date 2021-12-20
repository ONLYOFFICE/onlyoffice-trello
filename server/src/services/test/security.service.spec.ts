import {SecurityService} from '../security.service';

describe('Security Service', () => {
    let securityService: SecurityService;
    const text = 'hello';
    const key = '10'.repeat(16);

    beforeEach(async () => {
        securityService = new SecurityService();
    });

    it('aes encryption', () => {
        const encrypted = securityService.encrypt(text, key);
        expect(encrypted).not.toBeNull();
    });

    it('aes decryption', () => {
        const encrypted = securityService.encrypt(text, key);
        const decrypted = securityService.decrypt(encrypted, key);

        expect(text).toEqual(decrypted);
    });

    it('aes invalid key', () => {
        const invKey = 'invalid';
        const t = () => {
            securityService.encrypt(text, invKey);
        };
        expect(t).toThrow();
    });

    it('jwt signature', () => {
        const sig = securityService.sign({test: 'ok'}, key);
        expect(sig).not.toBeNull();
    });

    it('jwt signature verification', () => {
        const sig = securityService.sign({test: 'ok'}, key);
        securityService.verify(sig, key);
    });
});
