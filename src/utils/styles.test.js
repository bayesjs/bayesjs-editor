import { bem } from './styles';

describe('Styles Utils', () => {
  describe('bem', () => {
    const styles = {
      component: 'component-value',
      component__element: 'component__element-value',
      'component__element--primary': 'component__element--primary-value',
      'component--primary': 'component--primary-value',
      'component--invalid': 'component--invalid-value',
    };
    const componentClassName = bem(styles);
    const modifiers = {
      primary: true,
      invalid: false,
      unkown: true,
    };

    describe('When selecting the main component', () => {
      it('returns the first key-value', () => {
        expect(componentClassName.toString()).toBe('component-value');
      });

      describe('with modifiers', () => {
        it('returns the first key-value with valid modifiers', () => {
          expect(componentClassName.modifiers(modifiers).toString()).toBe('component-value component--primary-value');
        });
      });
    });

    describe('When selecting component element', () => {
      it('returns the first key-value with element', () => {
        expect(componentClassName.element('element').toString()).toBe('component__element-value');
      });

      describe('with modifiers', () => {
        it('returns the first key-value with element and valid modifiers', () => {
          expect(componentClassName.element('element').modifiers(modifiers).toString()).toBe(
            'component__element-value component__element--primary-value',
          );
        });
      });
    });
  });
});
