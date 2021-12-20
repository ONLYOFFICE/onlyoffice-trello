import {Constants} from '../const';
import {FileUtils} from '../file';

describe('File Utils', () => {
    let fileUtils: FileUtils;

    beforeEach(async () => {
        const constants = new Constants();
        fileUtils = new FileUtils(constants);
    });

    it('docx file', () => {
        const [supported, editable] = fileUtils.isExtensionSupported('docx');
        expect(supported).toBe(true);
        expect(editable).toBe(true);
    });

    it('doc file', () => {
        const [supported, editable] = fileUtils.isExtensionSupported('doc');
        expect(supported).toBe(true);
        expect(editable).toBe(false);
    });

    it('unknown file', () => {
        const [supported, editable] = fileUtils.isExtensionSupported('zzz');
        expect(supported).toBe(false);
        expect(editable).toBe(false);
    });
});
