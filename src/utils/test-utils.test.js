import { getComponentTestId } from './test-utils';

describe('Test Utils', () => {
  describe('getComponentTestId', () => {
    describe('When passing just the component name as "ComponentName"', () => {
      it('returns in kebab case', () => {
        expect(getComponentTestId('ComponentName')).toBe('component-name');
      });

      it('and passing "SubItem" returns "component-name__sub-item"', () => {
        expect(getComponentTestId('ComponentName', 'SubItem')).toBe('component-name__sub-item');
      });

      it('and passing "itemOne" returns "component-name__item-one"', () => {
        expect(getComponentTestId('ComponentName', 'itemOne')).toBe('component-name__item-one');
      });

      it('and passing "Item1" and "Item2" returns "component-name__item1-item2"', () => {
        expect(getComponentTestId('ComponentName', 'Item1', 'Item2')).toBe('component-name__item1-item2');
      });
    });
  });
});
